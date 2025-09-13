import { IWeatherData, IWeatherForecast } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import IWeatherAnalysisService from './weather-analysis.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';

export default class IWeatherPredictionService {
    private todaysWeatherData: IWeatherData[];
    private oneDayAgoWeatherData: IWeatherData[];
    private twoDaysAgoWeatherData: IWeatherData[];
    private threeDaysAgoWeatherData: IWeatherData[];

    private config: IWeatherConfig = loadWeatherConfig();
    private analysisService: IWeatherAnalysisService;

    private MOST_RECENT_DATA_INDEX: number = 0;
    private PRESSURE_GRADIENT: number = -0.2;
    private MINIMUM_WIND_VALUE: number = 10;
    private DAY_FACTOR_CONSTANT: number = 24;

    constructor(
        todaysWeatherData: IWeatherData[],
        oneDayAgoWeatherData: IWeatherData[],
        twoDaysAgoWeatherData: IWeatherData[],
        threeDaysAgoWeatherData: IWeatherData[],
        sunData: ISunDataResult
    ) {
        this.todaysWeatherData = todaysWeatherData;
        this.oneDayAgoWeatherData = oneDayAgoWeatherData;
        this.twoDaysAgoWeatherData = twoDaysAgoWeatherData;
        this.threeDaysAgoWeatherData = threeDaysAgoWeatherData;

        this.analysisService = new IWeatherAnalysisService([], sunData);
    }

    /**
     * A function that determines forecasted temperature and conditions based on
     * the given weather data history.
     *
     * @param weatherData the data to forecast from
     * @returns the forecasted condition and temperature
     */
    private getWeatherForecast(weatherData: IWeatherData[]): IWeatherForecast {
        const predictedTemperature =
            this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX].tempf +
            this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX].tempf *
                this.analysisService.getDataTrend(weatherData, 'tempf') *
                (weatherData.length / this.DAY_FACTOR_CONSTANT);

        let predictedCondition = '';

        const pressureTrend = this.analysisService.getDataTrend(weatherData, 'baromabsin');
        const hasRainedToday =
            this.analysisService.getDataMax(this.todaysWeatherData, 'hourlyrainin') > 0;
        const windMaxToday = this.analysisService.getDataMax(
            this.todaysWeatherData,
            'windspeedmph'
        );
        const windTrendOverall = this.analysisService.getDataTrend(weatherData, 'windspeedmph');

        if (pressureTrend < this.PRESSURE_GRADIENT) {
            if (hasRainedToday) {
                if (pressureTrend < this.PRESSURE_GRADIENT * 2) {
                    predictedCondition = this.config.WEATHER_STORM;
                } else {
                    predictedCondition = this.config.WEATHER_RAIN;
                }
            } else {
                predictedCondition = this.config.WEATHER_CLOUDS;
            }
        } else if (
            windTrendOverall * (weatherData.length / this.DAY_FACTOR_CONSTANT) + windMaxToday >
            this.MINIMUM_WIND_VALUE
        ) {
            predictedCondition = this.config.WEATHER_WIND;
        } else {
            if (this.analysisService.getHelperService().isDaytime(new Date())) {
                predictedCondition = this.config.WEATHER_SUNNY;
            } else {
                predictedCondition = this.config.WEATHER_CLEAR;
            }
        }

        return {
            temperatue: predictedTemperature,
            condition: predictedCondition
        };
    }

    /**
     * A function that gets the forecast for tomorrow.
     *
     * @returns the forecasted condition and temperature for tomorrow
     */
    public getTomorrowForecast(): IWeatherForecast {
        return this.getWeatherForecast([...this.todaysWeatherData, ...this.oneDayAgoWeatherData]);
    }

    /**
     * A function that gets the forecast for two days from now.
     *
     * @returns the forecasted condition and temperature for two days from now
     */
    public getTwoDayForecast(): IWeatherForecast {
        return this.getWeatherForecast([
            ...this.todaysWeatherData,
            ...this.oneDayAgoWeatherData,
            ...this.twoDaysAgoWeatherData
        ]);
    }

    /**
     * A function that gets the forecast for three days from now.
     *
     * @returns the forecasted condition and temperature for three days from now
     */
    public getThreeDayForecast(): IWeatherForecast {
        return this.getWeatherForecast([
            ...this.todaysWeatherData,
            ...this.oneDayAgoWeatherData,
            ...this.twoDaysAgoWeatherData,
            ...this.threeDaysAgoWeatherData
        ]);
    }
}
