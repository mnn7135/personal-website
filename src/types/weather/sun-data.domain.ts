export interface ISunDataResult {
    sunrise: Date,
    sunset: Date,
    solar_noon: Date,
    day_length: number,
    civil_twilight_begin: Date,
    civil_twilight_end: Date,
    nautical_twilight_begin: Date,
    nautical_twilight_end: Date,
    astronomical_twilight_begin: Date,
    astronomical_twilight_end: Date
}

export interface ISunData {
    results: ISunDataResult,
    status: string,
    tzid: string
}