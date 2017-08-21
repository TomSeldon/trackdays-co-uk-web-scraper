import * as request from 'request';

import { PageObjectFactory } from './page-object-factory';
import { TrackdaySummary } from './trackday-summary';

export class WebScraper {
    constructor(private pageObjectFactory: PageObjectFactory) {}

    getEventSummaries(): Promise<TrackdaySummary[]> {
        return Promise.all([
            this.getCarEventSummaries(),
            this.getBikeEventSummaries()
        ]).then(result => [...result[0], ...result[1]]);
    }

    getCarEventSummaries(): Promise<TrackdaySummary[]> {
        const url = 'https://www.trackdays.co.uk/calendar/cars/';

        return this.fetchEventsAtUrl(url);
    }

    getCarEventSummariesAtVenue(venue: string): Promise<TrackdaySummary[]> {
        return this.getCarEventSummaries().then(events =>
            events.filter(
                event => event.track.name.toLowerCase() === venue.toLowerCase()
            )
        );
    }

    getBikeEventSummaries(): Promise<TrackdaySummary[]> {
        const url = 'https://www.trackdays.co.uk/calendar/bikes/';

        return this.fetchEventsAtUrl(url);
    }

    getBikeEventSummariesAtVenue(venue: string): Promise<TrackdaySummary[]> {
        return this.getBikeEventSummaries().then(events =>
            events.filter(
                event => event.track.name.toLowerCase() === venue.toLowerCase()
            )
        );
    }

    private fetchEventsAtUrl(url: string): Promise<TrackdaySummary[]> {
        return new Promise((resolve, reject) => {
            const options: request.CoreOptions = {
                method: 'GET',
                headers: {
                    // User-agent spoofing required otherwise the remote server infinitely redirects to itself
                    'User-Agent':
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
                }
            };

            request(url, options, (error, response, body) => {
                if (error) {
                    console.error(error);
                }

                if (error || (response && response.statusCode !== 200)) {
                    throw new Error(`Unable to load URL: ${url}`);
                }

                const page = this.pageObjectFactory.createEventListPage(body);

                resolve(page.getAllEvents());
            });
        });
    }
}
