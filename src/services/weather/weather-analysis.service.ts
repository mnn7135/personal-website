import { IWeatherData } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import IWeatherHelperService from './weather-helper.service';

export default class IWeatherAnalysisService {
    private config: IWeatherConfig = loadWeatherConfig();
    private helperService: IWeatherHelperService;

    private weatherData: IWeatherData[];

    private MOST_RECENT_DATA_INDEX: number = 0;
    private HOUR_AGO_DATA_INDEX: number = 13;
    private BREEZY_MIN_SPEED: number = 15;
    private BREEZY_MAX_SPEED: number = 20;
    private PRESSURE_GRADIENT: number = 2.5; // Based on observations from weather station data.
    private DEW_POINT_TEMP_DIFF: number = 4.5;
    private MAXIMUM_HUMIDITY: number = 100;
    private CLOUDY_SOLAR_RAD: number = 200;
    private SUNNY_SOLAR_RAD: number = 450;
    private FREEZING_POINT_F: number = 32;

    /**
     * The constructor for the WeatherAnalysis service.
     */
    constructor(weatherData: IWeatherData[], sunData: ISunDataResult) {
        this.weatherData = weatherData;
        this.helperService = new IWeatherHelperService(sunData);
    }

    /**
     * A function that gets the helper service.
     *
     * @returns the helper service
     */
    public getHelperService(): IWeatherHelperService {
        return this.helperService;
    }

    /**
     * A setter function for the weather data.
     * @param weatherData The weather data to set
     */
    public setWeatherData(weatherData: IWeatherData[]) {
        this.weatherData = weatherData;
    }

    /**
     * A helper function that gets any active local weather warnings or advisories.
     *
     * @returns a local weather warning or advisory
     */
    public getActiveAlerts(): string[] {
        let alertMessages: string[] = [];
        const lastHourWeatherData: IWeatherData[] = this.weatherData.slice(
            this.MOST_RECENT_DATA_INDEX,
            this.HOUR_AGO_DATA_INDEX
        );
        const maxGust = this.getDataMax(lastHourWeatherData, 'windgustmph');
        const maxWind = this.getDataMax(lastHourWeatherData, 'windspdmph_avg10m');

        const adjustedGustSpeed = maxGust * this.config.WIND_DAMPENING_EFFECT_SCALE_FACTOR;
        const adjustedWindSpeed = maxWind * this.config.WIND_DAMPENING_EFFECT_SCALE_FACTOR;

        const maxTemp = this.getDataMax(lastHourWeatherData, 'tempf');
        const windChill = this.helperService.getWindChill(maxTemp, adjustedWindSpeed);
        const hourlyRain = this.getDataMax(lastHourWeatherData, 'hourlyrainin');

        // Weather alerts here are determined using values provided by the National Weather
        // Service (NWS).
        if (
            (adjustedGustSpeed >= 46 && adjustedGustSpeed <= 57) ||
            (adjustedWindSpeed >= 31 && adjustedWindSpeed >= 39)
        ) {
            alertMessages.push(this.config.WIND_ADVISORY.toUpperCase());
        } else if ((adjustedGustSpeed >= 58 || adjustedWindSpeed >= 40) && hourlyRain < 1) {
            alertMessages.push(this.config.HIGH_WIND_WARNING.toUpperCase());
        }

        if (maxTemp < 105 && maxTemp >= 100) {
            alertMessages.push(this.config.HEAT_ADVISORY.toUpperCase());
        } else if (maxTemp >= 105) {
            alertMessages.push(this.config.EXCESSIVE_HEAT_WARNING.toUpperCase());
        }

        if (maxTemp <= 50 && adjustedWindSpeed >= 5 && windChill <= -25) {
            alertMessages.push(this.config.WIND_CHILL_WARNING.toUpperCase());
        } else if (maxTemp <= 50 && adjustedWindSpeed >= 5 && windChill <= -15 && windChill > -25) {
            alertMessages.push(this.config.WIND_CHILL_ADVISORY.toUpperCase());
        }
        if (hourlyRain >= 1 && adjustedGustSpeed >= 58) {
            alertMessages.push(this.config.SEVERE_THUNDERSTORM_WARNING.toUpperCase());
        }
        if (hourlyRain >= 3) {
            alertMessages.push(this.config.FLASH_FLOOD_WARNING.toUpperCase());
        }

        return alertMessages;
    }

    /**
     * A helper function that determines the maximum value of a given data property of weather data.
     *
     * @param data The weather data to find the maximum value of
     * @param dataProperty The property of the weather data to find the maximum of
     * @returns The maximum value of the data property in the given data
     */
    public getDataMax(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        let dataMax: number = 0;
        for (const row of data) {
            if ((row[dataKey] as number) > dataMax) {
                dataMax = row[dataKey] as number;
            }
        }
        return dataMax;
    }

    /**
     * A helper function that determines the minimum value of a given data property of weather data.
     *
     * @param data The weather data to find the minimum value of
     * @param dataProperty The property of the weather data to find the minimum of
     * @returns The minimum value of the data property in the given data
     */
    public getDataMin(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        let dataMin: number = Number.MAX_SAFE_INTEGER;
        for (const row of data) {
            if ((row[dataKey] as number) < dataMin) {
                dataMin = row[dataKey] as number;
            }
        }
        return dataMin;
    }

    /**
     * A helper function that determines the trend of a given data property of weather data.
     *
     * @param data The weather data to find the trend of
     * @param dataProperty The property of the weather data to find the trend of
     * @returns
     */
    public getDataTrend(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        const dataLength: number = data.length;
        const dataTrend =
            ((data[dataLength - 1][dataKey] as number) - (data[0][dataKey] as number)) / dataLength;
        return dataTrend;
    }

    /**
     * A helper function that determines the difference between points of a given data property of weather data.
     *
     * @param data The weather data to find the point difference of
     * @param dataProperty The property of the weather data to find the point difference of
     * @returns
     */
    public getDataPointDifference(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        const dataLength: number = data.length;
        const pointDifference =
            (data[dataLength - 1][dataKey] as number) - (data[0][dataKey] as number);
        return pointDifference;
    }

    /**
     * A helper function that determines the average value of a given data property of weather data.
     *
     * @param data The weather data to find the average value of
     * @param dataProperty The property of the weather data to find the average of
     * @returns
     */
    public getDataAverage(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        const dataLength: number = data.length;
        let dataSum = 0;
        for (const row of data) {
            dataSum += row[dataKey] as number;
        }
        return dataSum / dataLength;
    }

    /**
     * A helper function that gets the current weather condition.
     *
     * @returns The current weather condition represented as a string.
     */
    public getCurrentWeatherCondition(): string {
        let weatherCondition = '';
        const isDaytime = this.helperService.isDaytime(this.helperService.getCurrentTime());

        const averageWindSpeed =
            this.weatherData[this.MOST_RECENT_DATA_INDEX].windspdmph_avg10m ?? 0;
        const adjustedWindSpeed = averageWindSpeed * this.config.WIND_DAMPENING_EFFECT_SCALE_FACTOR;
        const hourlyRainfall = this.weatherData[this.MOST_RECENT_DATA_INDEX].hourlyrainin ?? 0;
        const humidity = this.weatherData[this.MOST_RECENT_DATA_INDEX].humidity;
        const temperature = this.weatherData[this.MOST_RECENT_DATA_INDEX].tempf;
        const dewPoint = this.weatherData[this.MOST_RECENT_DATA_INDEX].dewPoint;
        const solarRadiation = this.weatherData[this.MOST_RECENT_DATA_INDEX].solarradiation;

        const pressureTrend = this.getDataTrend(this.weatherData, 'baromabsin');
        const maxSolarRadiationToday = this.getDataMax(this.weatherData, 'solarradiation');

        if (hourlyRainfall > 0) {
            if (temperature > this.FREEZING_POINT_F) {
                weatherCondition = this.config.WEATHER_RAIN;
            } else {
                weatherCondition = this.config.WEATHER_SNOW;
            }
            if (Math.abs(pressureTrend) > this.PRESSURE_GRADIENT) {
                if (temperature > this.FREEZING_POINT_F) {
                    weatherCondition = this.config.WEATHER_STORM;
                } else {
                    weatherCondition = this.config.WEATHER_SNOW;
                }
            }
        } else if (
            adjustedWindSpeed >= this.BREEZY_MIN_SPEED &&
            adjustedWindSpeed < this.BREEZY_MAX_SPEED
        ) {
            weatherCondition = this.config.WEATHER_BREEZE;
        } else if (adjustedWindSpeed >= this.BREEZY_MAX_SPEED) {
            weatherCondition = this.config.WEATHER_WIND;
        } else if (
            humidity >= this.MAXIMUM_HUMIDITY &&
            temperature - dewPoint <= this.DEW_POINT_TEMP_DIFF
        ) {
            weatherCondition = this.config.WEATHER_FOG;
        } else {
            if (isDaytime) {
                if (solarRadiation > this.SUNNY_SOLAR_RAD) {
                    weatherCondition = this.config.WEATHER_SUNNY;
                } else if (
                    solarRadiation <= this.SUNNY_SOLAR_RAD &&
                    solarRadiation >= this.CLOUDY_SOLAR_RAD
                ) {
                    weatherCondition = this.config.WEATHER_PARTLY_CLOUDS;
                } else {
                    weatherCondition = this.config.WEATHER_CLOUDS;
                }
            } else {
                if (pressureTrend < this.PRESSURE_GRADIENT) {
                    weatherCondition = this.config.WEATHER_CLOUDS;
                } else {
                    if (maxSolarRadiationToday < this.SUNNY_SOLAR_RAD) {
                        weatherCondition = this.config.WEATHER_CLOUDS;
                    } else {
                        weatherCondition = this.config.WEATHER_CLEAR;
                    }
                }
            }
        }

        return weatherCondition;
    }
}
