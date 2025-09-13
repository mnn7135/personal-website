export interface IWeatherData {
    dateutc: number;
    tempinf: number;
    humidityin: number;
    baromrelin: number;
    baromabsin: number;
    tempf: number;
    humidity: number;
    winddir: number;
    winddir_avg10m: number;
    windspeedmph: number;
    windspdmph_avg10m: number;
    windgustmph: number;
    maxdailygust: number;
    hourlyrainin: number;
    eventrainin: number;
    dailyrainin: number;
    weeklyrainin: number;
    monthlyrainin: number;
    yearlyrainin: number;
    solarradiation: number;
    uv: number;
    feelsLike: number;
    feelsLikein: number;
    dewPoint: number;
    dewPointin: number;
    lastRain: Date;
    date: Date;
}

export interface IWeatherForecast {
    temperatue: number;
    condition: string;
}
