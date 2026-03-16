import { IWeatherData, IWeatherForecast } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import IWeatherAnalysisService from './weather-analysis.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';

export default class IWeatherPredictionService {
    private todaysWeatherData: IWeatherData[];
    private historicalWeatherData: IWeatherData[];
    private currentWeatherData: IWeatherData;
    private historyDataLength: number;

    private config: IWeatherConfig = loadWeatherConfig();
    private analysisService: IWeatherAnalysisService;

    private MOST_RECENT_DATA_INDEX: number = 0;
    private PRESSURE_GRADIENT: number = 2.5; // Based on observations from weather station data.
    private MINIMUM_WIND_VALUE: number = 10;
    private FREEZING_POINT_F: number = 32;

    constructor(
        todaysWeatherData: IWeatherData[],
        historicalWeatherData: IWeatherData[],
        sunData: ISunDataResult
    ) {
        this.todaysWeatherData = todaysWeatherData;
        this.historicalWeatherData = historicalWeatherData;
        this.historyDataLength = historicalWeatherData.length - 1;
        this.analysisService = new IWeatherAnalysisService([], sunData);

        // This is needed to ensure that pressure is correctly converted from inHg to millibar.
        this.currentWeatherData = {
            ...this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX],
            baromabsin: this.analysisService
                .getHelperService()
                .getPressureInMbar(this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX].baromabsin)
        };
    }

    /**
     * A function that determines forecasted temperature and conditions based on
     * the given weather data history.
     *
     * @param weatherData the data to forecast from
     * @param daysOut the value that indicates the number of days out from the current day
     * @returns the forecasted condition and temperature
     */
    private getWeatherForecast(weatherData: IWeatherData[]): IWeatherForecast {
        /**
         * To predict the weather condition, determine the pressure trend for the data period. In
         * addition, determine if it has rained today. Measure for other weather conditions to
         * determine if those special conditions warrant display.
         */
        let predictedCondition = '';

        const pressureTrend = this.analysisService.getDataPointDifference(
            weatherData,
            'baromabsin'
        );

        const windTrendOverall = this.analysisService.getDataTrend(
            weatherData,
            'windspdmph_avg10m'
        );

        const predictedWindSpeed = Math.abs(windTrendOverall) + Math.abs(pressureTrend);

        const averageWindDirection = this.analysisService.getDataAverage(
            weatherData,
            'winddir_avg10m'
        );

        let windDirectionEffect = 0;
        if (
            this.analysisService
                .getHelperService()
                .getWindDirection(averageWindDirection)
                .startsWith('N')
        ) {
            windDirectionEffect = -1; // Cold, Dry air from the north.
        } else if (
            this.analysisService
                .getHelperService()
                .getWindDirection(averageWindDirection)
                .startsWith('S')
        ) {
            windDirectionEffect = 1; // Warm, Moist air from the south.
        }
        const predictedWindTemperatureDifference = predictedWindSpeed * 0.6 * windDirectionEffect;
        const temperatureTrend = this.analysisService.getDataTrend(weatherData, 'tempf');

        const predictedTemperature =
            weatherData[this.MOST_RECENT_DATA_INDEX].tempf +
            predictedWindTemperatureDifference +
            temperatureTrend;

        // Extreme changes in pressure tend to indicate unstable weather, potentially storms.
        if (Math.abs(pressureTrend) > this.PRESSURE_GRADIENT) {
            if (Math.abs(pressureTrend) >= 2 * this.PRESSURE_GRADIENT) {
                if (predictedTemperature > this.FREEZING_POINT_F) {
                    predictedCondition = this.config.WEATHER_STORM;
                } else {
                    predictedCondition = this.config.WEATHER_SNOW;
                }
            } else {
                if (predictedTemperature > this.FREEZING_POINT_F) {
                    predictedCondition = this.config.WEATHER_RAIN;
                } else {
                    predictedCondition = this.config.WEATHER_SNOW;
                }
            }
        } else if (predictedWindSpeed > this.MINIMUM_WIND_VALUE) {
            predictedCondition = this.config.WEATHER_WIND;
        } else {
            predictedCondition = this.config.WEATHER_SUNNY;
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
        // Last two days' data, today's data, and current conditions.
        return this.getWeatherForecast([
            this.currentWeatherData,
            this.historicalWeatherData[this.historyDataLength],
            ...this.historicalWeatherData.slice(-3, -1)
        ]);
    }

    /**
     * A function that gets the forecast for two days from now.
     *
     * @returns the forecasted condition and temperature for two days from now
     */
    public getTwoDayForecast(): IWeatherForecast {
        // Last week up to two days agos' data, today's data, and current conditions.
        return this.getWeatherForecast([
            this.currentWeatherData,
            this.historicalWeatherData[this.historyDataLength],
            ...this.historicalWeatherData.slice(-8, -3)
        ]);
    }

    /**
     * A function that gets the forecast for three days from now.
     *
     * @returns the forecasted condition and temperature for three days from now
     */
    public getThreeDayForecast(): IWeatherForecast {
        // Last two weeks up to last weeks' data, today's data, and current conditions.
        return this.getWeatherForecast([
            this.currentWeatherData,
            this.historicalWeatherData[this.historyDataLength],
            ...this.historicalWeatherData.slice(-15, -8)
        ]);
    }
}
