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

    private hasDataBeenSubmittedToday: boolean;

    private MOST_RECENT_DATA_INDEX: number = 0;
    private PRESSURE_GRADIENT: number = 2.5; // Based on observations from weather station data.
    private MINIMUM_WIND_VALUE: number = 10;
    private DAY_FACTOR_CONSTANT: number = 288;

    constructor(
        todaysWeatherData: IWeatherData[],
        historicalWeatherData: IWeatherData[],
        sunData: ISunDataResult
    ) {
        this.todaysWeatherData = todaysWeatherData;
        this.historicalWeatherData = historicalWeatherData;
        this.historyDataLength = historicalWeatherData.length - 1;
        this.analysisService = new IWeatherAnalysisService([], sunData);
        this.hasDataBeenSubmittedToday = this.hasWeatherDataBeenSubmittedToday();
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

        const predictedWindSpeed =
            Math.abs(windTrendOverall) + Math.abs((pressureTrend * weatherData.length) / 3);

        const averageWindDirection = this.analysisService.getDataAverage(
            weatherData,
            'winddir_avg10m'
        );

        let windDirectionEffect = 1; // Warm, Moist air from the south.
        if (
            this.analysisService
                .getHelperService()
                .getWindDirection(averageWindDirection)
                .includes('N')
        ) {
            windDirectionEffect = -1; // Cold, Dry air from the north.
        }
        const predictedWindTemperatureDifference = predictedWindSpeed * 0.6 * windDirectionEffect;

        /**
         * Determine the temperature using the average of the maximum temperature and average temperature
         * as recorded in the weatherData object. This should of course, also factor in the general
         * temperature trend to determine a value.
         */
        const temperatureTrend = this.analysisService.getDataTrend(weatherData, 'tempf');

        const predictedTemperature =
            weatherData[this.MOST_RECENT_DATA_INDEX].tempf +
            predictedWindTemperatureDifference +
            temperatureTrend +
            (((Math.abs(temperatureTrend) + 1) / (temperatureTrend + 1)) *
                (this.analysisService.getDataMax(weatherData, 'tempf') -
                    this.analysisService.getDataMin(weatherData, 'tempf'))) /
                weatherData.length;

        // Extreme changes in pressure tend to indicate unstable weather, potentially storms.
        if (Math.abs(pressureTrend) > this.PRESSURE_GRADIENT) {
            if (Math.abs(pressureTrend) >= 2 * this.PRESSURE_GRADIENT) {
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
        // Last two days' data.
        return this.getWeatherForecast([
            this.hasDataBeenSubmittedToday
                ? this.historicalWeatherData[this.historyDataLength]
                : this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX],
            ...this.historicalWeatherData.slice(-3, -1)
        ]);
    }

    /**
     * A function that gets the forecast for two days from now.
     *
     * @returns the forecasted condition and temperature for two days from now
     */
    public getTwoDayForecast(): IWeatherForecast {
        // Last week's data.
        return this.getWeatherForecast([
            this.hasDataBeenSubmittedToday
                ? this.historicalWeatherData[this.historyDataLength]
                : this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX],
            ...this.historicalWeatherData.slice(-8, -3)
        ]);
    }

    /**
     * A function that gets the forecast for three days from now.
     *
     * @returns the forecasted condition and temperature for three days from now
     */
    public getThreeDayForecast(): IWeatherForecast {
        // Last two week's data.
        return this.getWeatherForecast([
            this.hasDataBeenSubmittedToday
                ? this.historicalWeatherData[this.historyDataLength]
                : this.todaysWeatherData[this.MOST_RECENT_DATA_INDEX],
            ...this.historicalWeatherData.slice(-15, -8)
        ]);
    }

    /**
     * A helper function to determine if today's data has been submitted, and thus
     * which data to include or exclude.
     */
    private hasWeatherDataBeenSubmittedToday(): boolean {
        const historicalDate = new Date(
            this.historicalWeatherData[this.historyDataLength].date
        ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return today == historicalDate;
    }
}
