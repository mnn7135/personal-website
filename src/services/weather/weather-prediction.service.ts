import { IWeatherData, IWeatherForecast } from '@/types/weather/weather-data.domain';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import IWeatherAnalysisService from './weather-analysis.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';

export default class IWeatherPredictionService {
    private todaysWeatherData: IWeatherData[];
    private historicalWeatherData: IWeatherData[];
    private historyDataLength: number;

    private config: IWeatherConfig = loadWeatherConfig();
    private analysisService: IWeatherAnalysisService;

    private MOST_RECENT_DATA_INDEX: number = 0;
    private PRESSURE_GRADIENT: number = -0.2;
    private MINIMUM_WIND_VALUE: number = 10;
    private DAY_FACTOR_CONSTANT: number = 288;
    private HOURS_IN_A_DAY = 24;

    constructor(
        todaysWeatherData: IWeatherData[],
        historicalWeatherData: IWeatherData[],
        sunData: ISunDataResult
    ) {
        this.todaysWeatherData = todaysWeatherData;
        this.historicalWeatherData = historicalWeatherData;
        this.historyDataLength = historicalWeatherData.length - 1;
        this.analysisService = new IWeatherAnalysisService([], sunData);
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
         * Determine the temperature using the average of the maximum temperature and average temperature
         * as recorded in the weatherData object. This should of course, also factor in the general
         * temperature trend to determine a value.
         */
        const temperatureTrend = this.analysisService.getDataTrend(weatherData, 'tempf');

        const predictedTemperature =
            (this.analysisService.getDataMax(weatherData, 'tempf') +
                this.analysisService.getDataAverage(weatherData, 'tempf')) /
                2 +
            temperatureTrend;

        /**
         * To predict the weather condition, determine the pressure trend for the data period. In
         * addition, determine if it has rained today. Measure for other weather conditions to
         * determine if those special conditions warrant display.
         */
        let predictedCondition = '';

        const pressureTrend = this.analysisService.getDataTrend(weatherData, 'baromabsin');
        const hasRainedToday =
            this.analysisService.getDataMax(this.todaysWeatherData, 'hourlyrainin') > 0;
        const windMaxToday = this.analysisService.getDataMax(
            this.todaysWeatherData,
            'windspeedmph_avg10m'
        );
        const windTrendOverall = this.analysisService.getDataTrend(
            weatherData,
            'windspeedmph_avg10m'
        );

        if (pressureTrend < this.PRESSURE_GRADIENT) {
            if (hasRainedToday) {
                if (pressureTrend < this.PRESSURE_GRADIENT * 2) {
                    if (predictedTemperature > 32) {
                        predictedCondition = this.config.WEATHER_STORM;
                    } else {
                        predictedCondition = this.config.WEATHER_SNOW;
                    }
                } else {
                    if (predictedTemperature > 32) {
                        predictedCondition = this.config.WEATHER_RAIN;
                    } else {
                        predictedCondition = this.config.WEATHER_SNOW;
                    }
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
        // Last three days' data
        return this.getWeatherForecast([
            this.historicalWeatherData[this.historyDataLength],
            this.historicalWeatherData[this.historyDataLength - 1],
            this.historicalWeatherData[this.historyDataLength - 2]
        ]);
    }

    /**
     * A function that gets the forecast for two days from now.
     *
     * @returns the forecasted condition and temperature for two days from now
     */
    public getTwoDayForecast(): IWeatherForecast {
        // Last five days' data
        return this.getWeatherForecast([
            this.historicalWeatherData[this.historyDataLength],
            this.historicalWeatherData[this.historyDataLength - 1],
            this.historicalWeatherData[this.historyDataLength - 2],
            this.historicalWeatherData[this.historyDataLength - 3],
            this.historicalWeatherData[this.historyDataLength - 4]
        ]);
    }

    /**
     * A function that gets the forecast for three days from now.
     *
     * @returns the forecasted condition and temperature for three days from now
     */
    public getThreeDayForecast(): IWeatherForecast {
        // Last week's data
        return this.getWeatherForecast([
            this.historicalWeatherData[this.historyDataLength],
            this.historicalWeatherData[this.historyDataLength - 1],
            this.historicalWeatherData[this.historyDataLength - 2],
            this.historicalWeatherData[this.historyDataLength - 3],
            this.historicalWeatherData[this.historyDataLength - 4],
            this.historicalWeatherData[this.historyDataLength - 5],
            this.historicalWeatherData[this.historyDataLength - 6]
        ]);
    }
}
