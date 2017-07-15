# Web scraper for trackdays.co.uk

[![Build status](https://ci.appveyor.com/api/projects/status/8y93v4wrbjssjhxn/branch/master?svg=true)](https://ci.appveyor.com/project/TomSeldon/trackdays-co-uk-web-scraper/branch/master)
[![Build Status](https://travis-ci.org/TomSeldon/trackdays-co-uk-web-scraper.svg?branch=master)](https://travis-ci.org/TomSeldon/trackdays-co-uk-web-scraper)

> A small library for fetching event information from https://www.trackdays.co.uk

**Note: I have no affiliation with trackdays.co.uk**

## Basic usage

`npm install @trackdays-web-scraper/trackdays-co-uk`

```javascript
const trackdaysCoUkWebScraper = require('@trackdays-web-scraper/trackdays-co-uk');

trackdaysCoUkWebScraper.getEventSummaries()
    .then(events => {
        for (const event of events) {
            console.log(`${event.track.name} - ${event.track.layout} on ${event.eventDate}`);
        }
    });
```

## API

### `getEventSummaries`
Fetch summaries of all events for all vehicle types.

#### Method signature
```typescript
getEventSummaries(): Promise<TrackdaySummary[]>;
```

### `getCarEventSummaries`
Fetch summaries of all car track days.

#### Method signature
```typescript
getCarEventSummaries(): Promise<TrackdaySummary[]>;
```

### `getBikeEventSummaries`
Fetch summaries of all bike track days.

#### Method signature
```typescript
getBikeEventSummaries(): Promise<TrackdaySummary[]>;
```

### Return values

#### `TrackdaySummary`

```javascript
{
    eventDate: '2017-07-15',
    format: 'Open Pitlane',
    groups: [
        { groupType: 'NOVICE', isFull: false },
        { groupType: 'INTERMEDIATE', isFull: true },
        { groupType: 'ADVANCED', isFull: false }
    ],
    isFull: false,
    noiseLimits: {
        static: { limit: 102, units: 'dB(A)' },
        driveBy: { limit: 92, units: 'dB(A)' }
    },
    pricing: {
        price: 139,
        priceCurrencyCode: 'GBP',
        priceCurrencySymbol: '£'
    },
    track: { name: 'Woodbridge', layout: 'Full Circuit' },
    vehicleType: 'CAR',
    id: 10721
};
```

##### Notes: 

* `id` will only be available if the track day is available (i.e. it can still be booked).
* `groups` information is not always available. Sometimes an event may be available, but no group information will be supplied.
* Noise limits (static and drive by) will be included if available. There absence does not necessarily mean there's no limit,
  just that the organiser has not provided the data.
