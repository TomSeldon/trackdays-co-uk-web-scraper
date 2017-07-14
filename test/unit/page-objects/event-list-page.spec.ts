import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';

import { EventListPage } from '../../../src/page-objects/event-list-page';
import { PageObjectFactory } from '../../../src/page-object-factory';
import {
    Group,
    TrackdaySummary,
    VehicleType
} from '../../../src/trackday-summary';

const expect = chai.expect;

const fixturesFolder = path.resolve('./test/fixtures');

describe('event list page object', () => {
    let pageObjectFactory: PageObjectFactory;

    beforeEach(() => (pageObjectFactory = new PageObjectFactory()));

    describe('when parsing a page with no track days', () => {
        let eventListPage: EventListPage;

        beforeEach(() => {
            const fixture = fs
                .readFileSync(`${fixturesFolder}/event-list-cars--empty.html`)
                .toString();

            eventListPage = pageObjectFactory.createEventListPage(fixture);
        });

        it('should return an empty array', () => {
            expect(eventListPage.getAllEvents()).to.be.empty;
        });
    });

    describe('when parsing a page with multiple car track days', () => {
        let pageObject: EventListPage;

        beforeEach(() => {
            const fixture = fs
                .readFileSync(`${fixturesFolder}/event-list-cars.html`)
                .toString();

            pageObject = pageObjectFactory.createEventListPage(fixture);
        });

        it('should return an array containing multiple car track days', () => {
            const events = pageObject.getAllEvents();

            expect(events).not.to.be.empty;

            for (let event of events) {
                expect(event.vehicleType).to.equal(VehicleType.Car);
            }
        });
    });

    describe('when parsing a page with multiple bike track days', () => {
        let pageObject: EventListPage;

        beforeEach(() => {
            const fixture = fs
                .readFileSync(`${fixturesFolder}/event-list-bikes.html`)
                .toString();

            pageObject = pageObjectFactory.createEventListPage(fixture);
        });

        it('should return an array containing multiple bike track days', () => {
            const events = pageObject.getAllEvents();

            expect(events).not.to.be.empty;

            for (let event of events) {
                expect(event.vehicleType).to.equal(VehicleType.Bike);
            }
        });
    });

    describe('parsing information for an individual car track day', () => {
        let event: TrackdaySummary;

        beforeEach(() => {
            const fixture = fs
                .readFileSync(`${fixturesFolder}/event-list-cars--single.html`)
                .toString();

            const pageObject = pageObjectFactory.createEventListPage(fixture);

            event = pageObject.getAllEvents()[0];
        });

        it('should parse the event date correctly', () => {
            expect(event.eventDate).to.equal('2017-07-08');
        });

        it('should parse the track name correctly', () => {
            expect(event.track.name).to.equal('Kendrew Barracks');
        });

        it('should parse the track layout correctly', () => {
            expect(event.track.layout).to.equal('Airfield Track');
        });

        it('should parse the track day format correctly', () => {
            expect(event.format).to.equal('Open Pitlane');
        });

        it('should parse the event ID', () => {
            expect(event.id).to.equal(10980);
        });

        it('should parse if the track day is full', () => {
            expect(event.isFull).to.be.false;
        });

        it('should parse the vehicle type', () => {
            expect(event.vehicleType).to.equal(VehicleType.Car);
        });

        it('should parse the static noise limit', () => {
            expect(event.noiseLimits.static).not.to.be.undefined;

            if (event.noiseLimits.static === undefined) {
                throw new Error(
                    `Can't test static limits as static limit is undefined`
                );
            }

            expect(event.noiseLimits.static.limit).to.equal(105);
            expect(event.noiseLimits.static.units).to.equal('dB(A)');
        });

        it('should parse the drive by noise limit', () => {
            expect(event.noiseLimits.driveBy).not.to.be.undefined;

            if (event.noiseLimits.driveBy === undefined) {
                throw new Error(
                    `Can't test drive by limits as drive by limit is undefined`
                );
            }

            expect(event.noiseLimits.driveBy.limit).to.equal(98);
            expect(event.noiseLimits.driveBy.units).to.equal('dB(A)');
        });

        it('should parse the event price', () => {
            expect(event.pricing.price).to.equal(129);
            expect(event.pricing.priceCurrencyCode).to.equal('GBP');
            expect(event.pricing.priceCurrencySymbol).to.equal('£');
        });

        it('should parse the number of groups correctly', () => {
            expect(event.groups.length).to.equal(3);
        });

        it('should parse the availability of groups correctly', () => {
            expect(event.groups).to.deep.include({
                groupType: Group.Novice,
                isFull: false
            });

            expect(event.groups).to.deep.include({
                groupType: Group.Intermediate,
                isFull: true
            });

            expect(event.groups).to.deep.include({
                groupType: Group.Advanced,
                isFull: true
            });
        });
    });
});
