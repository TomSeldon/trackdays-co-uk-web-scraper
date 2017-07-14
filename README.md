# Web scraper for trackdays.co.uk

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
    groups: [],
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