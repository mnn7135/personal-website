import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import {
    faCloud,
    faCloudMoon,
    faCloudMoonRain,
    faCloudRain,
    faCloudSun,
    faCloudSunRain,
    faMoon,
    faSmog,
    faSnowflake,
    faSun,
    faThunderstorm,
    faWind
} from '@fortawesome/free-solid-svg-icons';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';

export default class IWeatherHelperService {
    private sunData: ISunDataResult;
    private weatherData: IWeatherData[];
    private lastWeekWeatherData: IWeatherData[];
    private today: Date;
    private lastWeek: Date;
    private config: IWeatherConfig = loadWeatherConfig();

    /**
     * Constructor for the WeatherHelper service.
     *
     * @param sunData the sunrise/sunset and other solar data
     * @param weatherData today's weather data
     * @param lastWeekWeatherData last week from today's weather data
     */
    constructor(
        sunData: ISunDataResult,
        weatherData: IWeatherData[],
        lastWeekWeatherData: IWeatherData[]
    ) {
        this.sunData = sunData;
        this.weatherData = weatherData;
        this.lastWeekWeatherData = lastWeekWeatherData;
        this.today = new Date();

        const tempDate = new Date();
        tempDate.setTime(this.today.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.lastWeek = tempDate;
    }

    /**
     * A helper function that determines the direction of the wind from angle.
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
     * Helper function that determines the risk based on the UV index.
     *
     * @param uvIndex The current measured UV index.
     * @returns The risk factor based on the UV index.
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

        return `(${uvRisk})`;
    }

    /**
     * A helper function that gets any active local weather warnings or advisories.
     *
     * @returns a local weather warning or advisory
     */
    public getActiveAlerts(): string {
        let alertMessage = '';
        const nowIndex = 0;

        const maxGust = this.getMaxGustSpeed(this.weatherData);
        const maxWind = this.getMaxWindSpeed(this.weatherData);
        const maxTemp = this.getMaxTemp(this.weatherData);
        const windChill = this.getWindChill(
            this.weatherData[nowIndex].tempf,
            this.weatherData[nowIndex].winddir
        );
        const hourlyRain = this.weatherData[nowIndex].hourlyrainin;

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
        //TODO: Add Blizzard Warning alert

        return alertMessage.toUpperCase();
    }

    /**
     * A helper function that determines the maximum temperature for a list of weather data.
     *
     * @param weatherData the data to find the max temperature of
     * @returns the maximum temperature of the data list
     */
    public getMaxTemp(weatherData: IWeatherData[]): number {
        let maxTemp = 0;
        for (const data of weatherData) {
            if (data.tempf > maxTemp) {
                maxTemp = data.tempf;
            }
        }
        return maxTemp;
    }

    /**
     * A helper function that determines the maximum wind gust for a list of weather data.
     *
     * @param weatherData the data to find the max wind gust of
     * @returns the maximum wind gust of the data list
     */
    public getMaxGustSpeed(weatherData: IWeatherData[]): number {
        let maxGustSpeed = 0;
        for (const data of weatherData) {
            if (data.windgustmph > maxGustSpeed) {
                maxGustSpeed = data.windgustmph;
            }
        }
        return maxGustSpeed;
    }

    /**
     * A helper function that determines the maximum wind speed for a list of weather data.
     *
     * @param weatherData the data to find the max wind speed of
     * @returns the maximum wind speed of the data list
     */
    public getMaxWindSpeed(weatherData: IWeatherData[]): number {
        let maxWindSpeed = 0;
        for (const data of weatherData) {
            if (data.windgustmph > maxWindSpeed) {
                maxWindSpeed = data.windspdmph_avg10m;
            }
        }
        return maxWindSpeed;
    }

    /**
     *
     * @param temperature
     * @param windSpeed
     * @returns
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
     * A helper function that converts an inHg pressure value to Mbar.
     *
     * @param pressure the inHg (inches Mercury) pressure value to convert
     * @returns a converted pressure value in Mbar
     */
    public getPressureMbar(pressure: number): number {
        return pressure * this.config.INCHES_MERCURY_TO_MBAR_CONVERSION;
    }

    /**
     *
     * @returns
     */
    public getCurrentTime(): Date {
        return this.today;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getWindSpeedAverage(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        let sum = 0;
        for (const data of weatherData) {
            sum += data.windspeedmph;
        }
        return sum / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getWindSpeedTrend(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        return (weatherData[size - 1].windspeedmph - weatherData[0].windspeedmph) / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getTemperatureTrend(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        return (weatherData[size - 1].tempf - weatherData[0].tempf) / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getTemperatureAverage(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        let sum = 0;
        for (const data of weatherData) {
            sum += data.tempf;
        }
        return sum / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getPressureTrend(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        return (weatherData[size - 1].baromrelin - weatherData[0].baromrelin) / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getPressureAverage(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        let sum = 0;
        for (const data of weatherData) {
            sum += data.baromrelin;
        }
        return sum / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getHumidityTrend(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        return (weatherData[size - 1].humidity - weatherData[0].humidity) / size;
    }

    /**
     *
     * @param weatherData
     * @returns
     */
    public getHumidityAverage(weatherData: IWeatherData[]): number {
        const size = weatherData.length;
        let sum = 0;
        for (const data of weatherData) {
            sum += data.humidity;
        }
        return sum / size;
    }

    /**
     * A helper method that determines if the provided date is after sunrise and before sunset (daytime).
     *
     * @param date the time to determine if it is day/night
     * @returns true if the provided date is daytime, false otherwise
     */
    private isDaytime(date: Date): boolean {
        return (
            new Date(date).getHours() >= new Date(this.sunData.sunrise).getHours() &&
            new Date(date).getHours() < new Date(this.sunData.sunset).getHours()
        );
    }

    /**
     * A helper method that gets the corresponding icon for the provided weather condition and time.
     *
     * @param weatherCondition The weather condition
     * @param date The time the condition occurs
     * @returns An icon representing the weather condition and time
     */
    public getWeatherIcon(weatherCondition: string, date: Date) {
        const isDaytime = this.isDaytime(date);

        switch (weatherCondition) {
            case 'Showers':
                return isDaytime ? faCloudSunRain : faCloudMoonRain;
            case 'Rain':
                return faCloudRain;
            case 'Partly Cloudy':
                return isDaytime ? faCloudSun : faCloudMoon;
            case 'Cloudy':
                return faCloud;
            case 'Sunny':
                return faSun;
            case 'Clear':
                return faMoon;
            case 'Windy':
            case 'Breezy':
                return faWind;
            case 'Foggy':
                return faSmog;
            case 'Stormy':
                return faThunderstorm;
            case 'Snowy':
                return faSnowflake;
        }
    }

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
     *
     * @returns
     */
    public getWeatherCondition(): string {
        let weatherCondition = '';

        const maxWindSpeed = this.weatherData[0].windspdmph_avg10m;
        const isDaytime =
            new Date(this.getCurrentTime()).getHours() >=
                new Date(this.sunData.sunrise).getHours() &&
            new Date(this.getCurrentTime()).getHours() < new Date(this.sunData.sunset).getHours();

        if (this.weatherData[0].hourlyrainin > 0) {
            weatherCondition = 'Rain';

            if (this.getPressureTrend(this.weatherData) < -0.2) {
                weatherCondition = 'Storms';
            }
        } else if (maxWindSpeed >= 15 && maxWindSpeed < 20) {
            weatherCondition = 'Breezy';
        } else if (maxWindSpeed >= 20) {
            weatherCondition = 'Windy';
        } else if (
            this.weatherData[0].humidity >= 100 &&
            this.weatherData[0].tempf - this.weatherData[0].dewPoint <= 4.5
        ) {
            weatherCondition = 'Foggy';
        } else {
            if (isDaytime) {
                if (this.weatherData[0].solarradiation > 450) {
                    weatherCondition = 'Sunny';
                } else if (
                    this.weatherData[0].solarradiation <= 450 &&
                    this.weatherData[0].solarradiation >= 200
                ) {
                    weatherCondition = 'Partly Cloudy';
                } else {
                    weatherCondition = 'Cloudy';
                }
            } else {
                if (this.getPressureTrend(this.weatherData) < -0.2) {
                    weatherCondition = 'Cloudy';
                } else {
                    weatherCondition = 'Clear';
                }
            }
        }

        return weatherCondition;
    }
}
