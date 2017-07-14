export enum Group {
    Novice = 'NOVICE',
    Intermediate = 'INTERMEDIATE',
    Advanced = 'ADVANCED'
}

export interface AvailableGroup {
    groupType: Group;
    isFull: boolean;
}

export interface NoiseLimit {
    limit: number;
    units: string;
}

export enum VehicleType {
    Car = 'CAR',
    Bike = 'BIKE'
}

export interface TrackdaySummary {
    eventDate: string;
    format: string;
    groups: AvailableGroup[];
    id?: number; // IDs are only present for events that are not fully booked
    isFull: boolean;
    noiseLimits: {
        static?: NoiseLimit;
        driveBy?: NoiseLimit;
    };
    pricing: {
        price: number;
        priceCurrencyCode: string;
        priceCurrencySymbol: string;
    };
    track: {
        name: string;
        layout: string;
    };
    vehicleType: VehicleType;
}
