import { IWeatherData } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import IWeatherHelperService from './weather-helper.service';

export default class IWeatherAnalysisService {
    private config: IWeatherConfig = loadWeatherConfig();
    private helperService: IWeatherHelperService;

    private weatherData: IWeatherData[];
    private sunData: ISunDataResult;

    private MOST_RECENT_DATA_INDEX: number = 0;
    private BREEZY_MIN_SPEED: number = 15;
    private BREEZY_MAX_SPEED: number = 20;
    private PRESSURE_GRADIENT: number = -0.2;
    private DEW_POINT_TEMP_DIFF: number = 4.5;
    private MAXIMUM_HUMIDITY: number = 100;
    private CLOUDY_SOLAR_RAD: number = 200;
    private SUNNY_SOLAR_RAD: number = 450;

    /**
     * The constructor for the WeatherAnalysis service.
     */
    constructor(weatherData: IWeatherData[], sunData: ISunDataResult) {
        this.weatherData = weatherData;
        this.sunData = sunData;
        this.helperService = new IWeatherHelperService(sunData);
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
    public getActiveAlerts(): string {
        let alertMessage = '';

        const maxGust = this.getDataMax(this.weatherData, 'windgustmph');
        const maxWind = this.getDataMax(this.weatherData, 'windspdmph_avg10m');
        const maxTemp = this.getDataMax(this.weatherData, 'tempf');
        const windChill = this.helperService.getWindChill(
            this.weatherData[this.MOST_RECENT_DATA_INDEX].tempf,
            this.weatherData[this.MOST_RECENT_DATA_INDEX].windspdmph_avg10m
        );
        const hourlyRain = this.weatherData[this.MOST_RECENT_DATA_INDEX].hourlyrainin;

        if ((maxGust >= 46 && maxGust <= 57) || (maxWind >= 31 && maxWind >= 39)) {
            alertMessage = this.config.WIND_ADVISORY;
        } else if ((maxGust >= 58 || maxWind >= 40) && hourlyRain < 1) {
            alertMessage = this.config.HIGH_WIND_WARNING;
        } else if (maxTemp < 105 && maxTemp >= 100) {
            alertMessage = this.config.HEAT_ADVISORY;
        } else if (maxTemp >= 105) {
            alertMessage = this.config.EXCESSIVE_HEAT_WARNING;
        } else if (maxTemp <= 50 && maxWind >= 5 && windChill <= -25) {
            alertMessage = this.config.WIND_CHILL_WARNING;
        } else if (maxTemp <= 50 && maxWind >= 5 && windChill <= -15 && windChill > -25) {
            alertMessage = this.config.WIND_CHILL_ADVISORY;
        } else if (hourlyRain >= 1 && maxGust >= 58) {
            alertMessage = this.config.SEVERE_THUNDERSTORM_WARNING;
        } else if (hourlyRain >= 3) {
            alertMessage = this.config.FLASH_FLOOD_WARNING;
        } else {
            alertMessage = this.config.NO_ALERTS;
        }

        return alertMessage.toUpperCase();
    }

    /**
     * A helper function that determines the maximum value of a given data property of weather data.
     *
     * @param data The weather data to find the maximum value of
     * @param dataProperty The property of the weather data to find the maximum of
     * @returns The maximum value of the data property in the given data
     */
    public getDataMax(data: IWeatherData[], dataProperty: string): number {
        let dataKey = dataProperty as keyof (typeof data)[0];
        let dataMax: any = undefined;
        for (const row of data) {
            if (row[dataKey] > dataMax) {
                dataMax = row[dataKey];
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
        var dataKey = dataProperty as keyof (typeof data)[0];
        var dataMin: any = undefined;
        for (const row of data) {
            if (row[dataKey] > dataMin) {
                dataMin = row[dataKey];
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
     * A helper function that determines the average value of a given data property of weather data.
     *
     * @param data The weather data to find the average value of
     * @param dataProperty The property of the weather data to find the average of
     * @returns
     */
    public getDataAverage(data: IWeatherData[], dataProperty: string): number {
        const dataKey = dataProperty as keyof (typeof data)[0];
        const dataLength: number = data.length;
        var dataSum = 0;
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
        var weatherCondition = '';
        const isDaytime = this.helperService.isDaytime(this.helperService.getCurrentTime());

        const maxWindSpeed = this.weatherData[0].windspdmph_avg10m;
        const pressureTrend = this.getDataTrend(this.weatherData, 'baromabsin');
        const hourlyRainfall = this.weatherData[0].hourlyrainin;
        const humidity = this.weatherData[0].humidity;
        const temperature = this.weatherData[0].tempf;
        const dewPoint = this.weatherData[0].dewPoint;
        const solarRadiation = this.weatherData[0].solarradiation;

        if (hourlyRainfall > 0) {
            weatherCondition = this.config.WEATHER_RAIN;
            if (pressureTrend < this.PRESSURE_GRADIENT) {
                weatherCondition = this.config.WEATHER_STORM;
            }
        } else if (maxWindSpeed >= this.BREEZY_MIN_SPEED && maxWindSpeed < this.BREEZY_MAX_SPEED) {
            weatherCondition = this.config.WEATHER_BREEZE;
        } else if (maxWindSpeed >= this.BREEZY_MAX_SPEED) {
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
                    weatherCondition = this.config.WEATHER_CLEAR;
                }
            }
        }

        return weatherCondition;
    }
}
