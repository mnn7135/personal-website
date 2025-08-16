import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';

export default class IWeatherHelperService {
    private today: Date;
    private sunData: ISunDataResult | undefined;
    private config: IWeatherConfig = loadWeatherConfig();

    /**
     * The constructor for the WeatherHelper service.
     */
    constructor(sunData?: ISunDataResult) {
        this.today = new Date();
        this.sunData = sunData;
    }

    /**
     * A helper function that determines the direction of the wind from a given angle.
     *
     * @param windAngle The measured angle from which the wind comes from in degrees.
     * @returns The direction, as a string, from which the comes from.
     */
    public getWindDirection(windAngle: number): string {
        let windDirection = '';

        if ((windAngle >= 348.75 && windAngle <= 360) || windAngle < 11.25) {
            windDirection = `${this.config.NORTH}`;
        } else if (11.25 <= windAngle && windAngle < 33.75) {
            windDirection = `${this.config.NORTH}${this.config.NORTH}${this.config.EAST}`;
        } else if (33.75 <= windAngle && windAngle < 56.25) {
            windDirection = `${this.config.NORTH}${this.config.EAST}`;
        } else if (56.25 <= windAngle && windAngle < 78.75) {
            windDirection = `${this.config.EAST}${this.config.NORTH}${this.config.EAST}`;
        } else if (78.75 <= windAngle && windAngle < 101.25) {
            windDirection = `${this.config.EAST}`;
        } else if (101.25 <= windAngle && windAngle < 123.75) {
            windDirection = `${this.config.EAST}${this.config.SOUTH}${this.config.EAST}`;
        } else if (123.75 <= windAngle && windAngle < 146.25) {
            windDirection = `${this.config.SOUTH}${this.config.EAST}`;
        } else if (146.25 <= windAngle && windAngle < 168.75) {
            windDirection = `${this.config.SOUTH}${this.config.SOUTH}${this.config.EAST}`;
        } else if (168.75 <= windAngle && windAngle < 191.25) {
            windDirection = `${this.config.SOUTH}`;
        } else if (191.25 <= windAngle && windAngle < 213.75) {
            windDirection = `${this.config.SOUTH}${this.config.SOUTH}${this.config.WEST}`;
        } else if (213.75 <= windAngle && windAngle < 236.25) {
            windDirection = `${this.config.SOUTH}${this.config.WEST}`;
        } else if (236.25 <= windAngle && windAngle < 258.75) {
            windDirection = `${this.config.WEST}${this.config.SOUTH}${this.config.WEST}`;
        } else if (258.75 <= windAngle && windAngle < 281.25) {
            windDirection = `${this.config.WEST}`;
        } else if (281.25 <= windAngle && windAngle < 303.75) {
            windDirection = `${this.config.WEST}${this.config.NORTH}${this.config.WEST}`;
        } else if (303.75 <= windAngle && windAngle < 326.25) {
            windDirection = `${this.config.NORTH}${this.config.WEST}`;
        } else if (326.25 <= windAngle && windAngle < 348.75) {
            windDirection = `${this.config.NORTH}${this.config.NORTH}${this.config.WEST}`;
        }

        return windDirection;
    }

    /**
     * A helper function that determines the UV risk based on the UV index.
     *
     * @param uvIndex The current UV index mesaured by the sensor
     * @returns A string representation of the risk factor based on the UV index
     */
    public getUVRisk(uvIndex: number): string {
        let uvRisk = '';

        if (uvIndex <= 2) {
            uvRisk = this.config.LOW_UV_RISK;
        } else if (uvIndex <= 5) {
            uvRisk = this.config.MODERATE_UV_RISK;
        } else if (uvIndex <= 7) {
            uvRisk = this.config.HIGH_UV_RISK;
        } else if (uvIndex <= 10) {
            uvRisk = this.config.VERY_HIGH_UV_RISK;
        } else if (uvIndex >= 11) {
            uvRisk = this.config.EXTREME_UV_RISK;
        }

        return `${uvIndex} (${uvRisk})`;
    }

    /**
     * A helper function that gets the relative wind chill factor based on the current temperature and wind speed.
     *
     * @param temperature The current outdoor temperature
     * @param windSpeed The current wind speed
     * @returns The effective wind chill factor based on the sensor data
     */
    public getWindChill(temperature: number, windSpeed: number): number {
        return (
            35.74 +
            0.6215 * windSpeed -
            Math.pow(35.75 * temperature, 0.16) +
            Math.pow(0.4275 * temperature * windSpeed, 0.16)
        );
    }

    /**
     * A helper function that converts an inHg pressure value to Mbar and rounds it to the nearest integer.
     *
     * @param pressure The in Hg (inches mercury) pressure value to convert
     * @returns A converted pressure value in mbar
     */
    public getPressureInMbar(pressure: number): number {
        return Math.round(pressure * this.config.INCHES_MERCURY_TO_MBAR_CONVERSION);
    }

    /**
     * A helper function that gets the current time.
     *
     * @returns The current time as a Date object
     */
    public getCurrentTime(): Date {
        return this.today;
    }

    /**
     * A helper function that returns a string representation of a day of the week number.
     *
     * @param day The current day of the week as a number
     * @returns The current day of the week as as string
     */
    public getDayStringFromNumber(day: number): string {
        switch (day) {
            case 1:
                return 'Monday';
            case 2:
                return 'Tuesday';
            case 3:
                return 'Wednesday';
            case 4:
                return 'Thursday';
            case 5:
                return 'Friday';
            case 6:
                return 'Saturday';
            case 0:
                return 'Sunday';
            default:
                return '';
        }
    }

    /**
     * A helper function that determines if the provided date is after sunrise and before sunset (daytime).
     *
     * @param date The time to determine if it is day/night
     * @returns True if the provided date is daytime, false otherwise
     */
    public isDaytime(date: Date): boolean {
        if (!this.sunData) {
            return false;
        }

        return (
            new Date(date).getHours() >= new Date(this.sunData.sunrise).getHours() &&
            new Date(date).getHours() < new Date(this.sunData.sunset).getHours()
        );
    }
}
