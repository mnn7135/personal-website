import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import IWeatherHelperService from './weather-analysis.service';

export default class IWeatherPredictionService {
    private weatherData: IWeatherData[];
    private lastWeekWeatherData: IWeatherData[];
    private helperService: IWeatherHelperService;
    private pressureTrendLastWeek: number;
    private pressureTrendToday: number;
    private pressureAverageLastWeek: number;
    private pressureAverageToday: number;
    private humidityTrendLastWeek: number;
    private humidityTrendToday: number;
    private humidityAverageLastWeek: number;
    private humidityAverageToday: number;
    private windSpeedTrendLastWeek: number;
    private windSpeedTrendToday: number;
    private windSpeedAverageLastWeek: number;
    private windSpeedAverageToday: number;
    private temperatureTrendLastWeek: number;
    private temperatureTrendToday: number;
    private temperatureAverageLastWeek: number;
    private temperatureAverageToday: number;
    private config: IWeatherConfig = loadWeatherConfig();

    constructor(
        sunData: ISunDataResult,
        weatherData: IWeatherData[],
        lastWeekWeatherData: IWeatherData[]
    ) {
        this.weatherData = weatherData;
        this.lastWeekWeatherData = lastWeekWeatherData;
        this.helperService = new IWeatherHelperService(sunData, weatherData, lastWeekWeatherData);

        this.pressureTrendLastWeek = this.helperService.getPressureTrend(this.lastWeekWeatherData);
        this.pressureTrendToday = this.helperService.getPressureTrend(this.weatherData);

        this.pressureAverageLastWeek = this.helperService.getPressureAverage(
            this.lastWeekWeatherData
        );
        this.pressureAverageToday = this.helperService.getPressureAverage(this.weatherData);

        this.humidityTrendLastWeek = this.helperService.getHumidityTrend(this.lastWeekWeatherData);
        this.humidityTrendToday = this.helperService.getHumidityTrend(this.weatherData);

        this.humidityAverageLastWeek = this.helperService.getHumidityAverage(
            this.lastWeekWeatherData
        );
        this.humidityAverageToday = this.helperService.getHumidityAverage(this.weatherData);

        this.windSpeedTrendLastWeek = this.helperService.getWindSpeedTrend(
            this.lastWeekWeatherData
        );
        this.windSpeedTrendToday = this.helperService.getWindSpeedTrend(this.weatherData);

        this.windSpeedAverageLastWeek = this.helperService.getWindSpeedAverage(
            this.lastWeekWeatherData
        );
        this.windSpeedAverageToday = this.helperService.getWindSpeedAverage(this.weatherData);

        this.temperatureTrendLastWeek = this.helperService.getTemperatureTrend(
            this.lastWeekWeatherData
        );
        this.temperatureTrendToday = this.helperService.getTemperatureTrend(this.weatherData);

        this.temperatureAverageLastWeek = this.helperService.getTemperatureAverage(
            this.lastWeekWeatherData
        );
        this.temperatureAverageToday = this.helperService.getTemperatureAverage(this.weatherData);
    }

    /**
     *
     * @param day
     * @returns
     */
    public predictWeather(day: Date): string {
        let weatherDesc = 'Sunny';
        const dayDiff = day.getDay() - this.helperService.getCurrentTime().getDay();
        const pressureFactor = this.computePressureFactor(dayDiff) * 100;
        const windFactor = this.computeWindFactor(dayDiff) * 100;
        const temperatureFactor = this.computeTemperatureFactor(dayDiff) * 100;
        const humidityFactor = this.computeHumidityFactor(dayDiff) * 100;

        // predict new temp
        const predictedTemperature = this.predictTemperature(day) + temperatureFactor * 0;

        if (windFactor > 5) {
            weatherDesc = this.config.WEATHER_WIND;
        } else if (windFactor > 2) {
            weatherDesc = this.config.WEATHER_BREEZE;
        } else {
            if (pressureFactor < -10) {
                if (predictedTemperature < 32) {
                    weatherDesc = this.config.WEATHER_SNOW;
                } else if (predictedTemperature > 32) {
                    if (humidityFactor > 40) {
                        weatherDesc = this.config.WEATHER_STORM;
                    } else if (humidityFactor > 20) {
                        weatherDesc = this.config.WEATHER_RAIN;
                    } else {
                        weatherDesc = this.config.WEATHER_CLOUDS;
                    }
                } else {
                    // Mixed conditions? Future enhancement.
                    weatherDesc = this.config.WEATHER_RAIN;
                }
            } else if (pressureFactor < 10 && pressureFactor > -10) {
                weatherDesc = this.config.WEATHER_PARTLY_CLOUDS;
            } else {
                weatherDesc = this.config.WEATHER_CLOUDS;
            }
        }

        return weatherDesc;
    }

    /**
     *
     * @param day
     * @returns
     */
    public predictTemperature(day: Date) {
        const dayDiff = (day.getDay() - this.helperService.getCurrentTime().getDay()) / 2;
        const temperatureFactor = this.computeTemperatureFactor(dayDiff) * 100;

        const tempTrend = (this.temperatureTrendLastWeek - this.temperatureTrendToday) / 2;

        const tempFactor =
            tempTrend * (this.temperatureTrendToday / this.temperatureTrendLastWeek) * dayDiff +
            this.temperatureAverageToday;
        return temperatureFactor * tempTrend + tempFactor;
    }

    private computeWindFactor(dayDiff: number) {
        const windSpeedTrendAvg = (this.windSpeedTrendToday + this.windSpeedTrendLastWeek) / 2;
        const windSpeedDifference = this.windSpeedAverageToday - this.windSpeedAverageLastWeek;

        return windSpeedDifference * windSpeedTrendAvg * dayDiff;
    }

    private computePressureFactor(dayDiff: number) {
        const pressureTrendAvg = (this.pressureTrendToday + this.pressureTrendLastWeek) / 2;
        const pressureDifference = this.pressureAverageToday - this.pressureAverageLastWeek;

        return pressureDifference * pressureTrendAvg * dayDiff;
    }

    private computeTemperatureFactor(dayDiff: number) {
        const temperatureTrendAvg =
            (this.temperatureTrendToday + this.temperatureTrendLastWeek) / 2;
        const temperatureDifference =
            this.temperatureAverageToday - this.temperatureAverageLastWeek;

        return temperatureDifference * temperatureTrendAvg * dayDiff;
    }

    private computeHumidityFactor(dayDiff: number) {
        const humidityTrendAvg = (this.humidityTrendToday + this.humidityTrendLastWeek) / 2;
        const humidityDifference = this.humidityAverageToday - this.humidityAverageLastWeek;

        return humidityDifference * humidityTrendAvg * dayDiff;
    }
}
