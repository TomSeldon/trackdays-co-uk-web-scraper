import * as cheerio from 'cheerio';
import * as moment from 'moment';

import {
    AvailableGroup,
    Group,
    NoiseLimit,
    TrackdaySummary,
    VehicleType
} from '../trackday-summary';

export class EventListPage {
    private page: CheerioStatic;

    constructor(private html: string) {
        this.page = cheerio.load(this.html);
    }

    getAllEvents(): TrackdaySummary[] {
        const unparsedEvents = this.page('.main-content td .row');

        if (!unparsedEvents.length) {
            return [];
        }

        const events: TrackdaySummary[] = [];
        const vehicleType: VehicleType = this.getVehicleType();

        unparsedEvents.each((index, event) =>
            events.push(this.parseEvent(vehicleType, event))
        );

        return events;
    }

    private parseEvent(
        vehicleType: VehicleType,
        event: CheerioElement
    ): TrackdaySummary {
        const trackDayInformation: TrackdaySummary = {
            eventDate: this.parseEventName(event),
            format: this.parseTrackDayFormat(event),
            groups: this.parseGroups(event),
            isFull: this.parseIsFull(event),
            noiseLimits: this.parseNoiseLimits(event),
            pricing: {
                price: this.parseEventPrice(event),
                priceCurrencyCode: this.parseEventPriceCurrencyCode(event),
                priceCurrencySymbol: this.parseEventPriceCurrencySymbol(event)
            },
            track: {
                name: this.parseTrackName(event),
                layout: this.parseTrackLayout(event)
            },
            vehicleType
        };

        const id = this.parseEventId(event);

        if (id !== undefined) {
            trackDayInformation.id = id;
        }

        return trackDayInformation;
    }

    private getVehicleType(): VehicleType {
        const heading = this.page('h1').text().toLowerCase();

        if (heading.includes('car')) {
            return VehicleType.Car;
        }

        if (heading.includes('bike')) {
            return VehicleType.Bike;
        }

        throw new Error(
            `Unable to determine vehicle type from heading: "${heading}`
        );
    }

    private parseEventName(event: CheerioElement): string {
        // Date is in DD/MM/YY format, we need to convert to YYYY-MM-DD
        const fromDateFormat = 'DD/MM/YY';
        const toDateFormat = 'YYYY-MM-DD';
        const rawDate = cheerio(event).find('div').eq(1).find('label').text();

        return moment(rawDate, fromDateFormat).format(toDateFormat);
    }

    private parseTrackName(event: CheerioElement): string {
        return cheerio(event).find('div').eq(2).find('label').text().trim();
    }

    private parseTrackLayout(event: CheerioElement): string {
        return cheerio(event).find('div').eq(3).find('label').text().trim();
    }

    private parseTrackDayFormat(event: CheerioElement): string {
        return cheerio(event).find('div').eq(4).find('label').text().trim();
    }

    private parseGroups(event: CheerioElement): AvailableGroup[] {
        const groupDivs = cheerio(event).find('div').eq(7).children();
        const groups: AvailableGroup[] = [];

        groupDivs.each((index, element) => {
            groups.push(this.parseGroup(element));
        });

        return groups;
    }

    private parseGroup(group: CheerioElement): AvailableGroup {
        const groupType = cheerio(group).text().trim().toUpperCase();
        const isFull = !cheerio(group).hasClass('groupavailable');

        switch (groupType) {
            case 'N':
                return { groupType: Group.Novice, isFull };

            case 'I':
                return { groupType: Group.Intermediate, isFull };

            case 'A':
                return { groupType: Group.Advanced, isFull };

            default:
                throw new Error(`Cannot parse group type from: "${groupType}"`);
        }
    }

    private parseEventId(event: CheerioElement): number | undefined {
        const detailsUrl = cheerio(event)
            .find('div')
            .eq(9)
            .find('a')
            .attr('href');

        if (!detailsUrl) {
            return;
        }

        const match = detailsUrl.match(/\/(\d+)\//);

        if (!match || !match[1]) {
            return;
        }

        const id = match[1];

        return parseInt(id, 10);
    }

    private parseIsFull(event: CheerioElement): boolean {
        const detailsButtonText = cheerio(event)
            .find('div')
            .eq(9)
            .text()
            .trim()
            .toLowerCase();

        switch (detailsButtonText) {
            case 'full':
                return true;

            case 'view':
                return false;

            default:
                throw new Error(
                    `Unable to determine if event is full: "${detailsButtonText}"`
                );
        }
    }

    private parseNoiseLimits(
        event: CheerioElement
    ): { static?: NoiseLimit; driveBy?: NoiseLimit } {
        const noiseLimits: { static?: NoiseLimit; driveBy?: NoiseLimit } = {};
        const staticNoiseLimit = this.parseStaticNoiseLimit(event);
        const driveByNoiseLimit = this.parseDriveByNoiseLimit(event);

        if (staticNoiseLimit) {
            noiseLimits.static = staticNoiseLimit;
        }

        if (driveByNoiseLimit) {
            noiseLimits.driveBy = driveByNoiseLimit;
        }

        return noiseLimits;
    }

    private parseStaticNoiseLimit(
        event: CheerioElement
    ): { limit: number; units: string } | undefined {
        const staticLimit = cheerio(event).find('div').eq(5);

        if (staticLimit.text().trim().length === 0) {
            return;
        }

        return {
            limit: parseInt(staticLimit.find('label:first-child').text(), 10),
            units: staticLimit.find('label span').eq(0).text().trim()
        };
    }

    private parseDriveByNoiseLimit(
        event: CheerioElement
    ): { limit: number; units: string } | undefined {
        const driveByLimit = cheerio(event).find('div').eq(6);

        if (driveByLimit.text().trim().length === 0) {
            return;
        }

        return {
            limit: parseInt(driveByLimit.find('label:first-child').text(), 10),
            units: driveByLimit.find('label span').eq(0).text().trim()
        };
    }

    private parseEventPrice(event: CheerioElement): number {
        const price = cheerio(event).find('div').eq(8).text();
        const match = price.match(/(\d+(\.\d+)?)/);

        if (!match) {
            throw new Error(
                `Cannot parse price as no pricing information found: ${price}`
            );
        }

        return parseInt(match[1], 10);
    }

    private parseEventPriceCurrencyCode(event: CheerioElement): string {
        const price = cheerio(event).find('div').eq(8).text();

        if (price.includes('£')) {
            return 'GBP';
        }

        throw new Error(`Cannot parse currency code from: "${price}"`);
    }

    private parseEventPriceCurrencySymbol(event: CheerioElement): string {
        const price = cheerio(event).find('div').eq(8).text();

        if (price.includes('£')) {
            return '£';
        }

        throw new Error(`Cannot parse currency symbol from: "${price}"`);
    }
}
