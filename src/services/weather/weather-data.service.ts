import { ISunData } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { AxiosServiceHelper } from '../axios/axios-helper.service';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import { env } from 'process';

export default class IWeatherDataService {
    private readonly serviceHelper: AxiosServiceHelper;
    private config: IWeatherConfig = loadWeatherConfig();

    private baseStationUrl: string = '';
    private baseSunUrl: string = '';

    constructor() {
        this.serviceHelper = new AxiosServiceHelper();

        // Weather Station URL
        this.baseStationUrl = this.config.BASE_STATION_URL.replace(
            'ELEMENT_0',
            env.DEVICE_MAC_ADDRESS!
        );
        this.baseStationUrl = this.baseStationUrl.replace('ELEMENT_1', env.API_KEY!);
        this.baseStationUrl = this.baseStationUrl.replace('ELEMENT_2', env.APPLICATION_KEY!);

        // Sun Data URL
        this.baseSunUrl = this.config.BASE_SUN_URL.replace('ELEMENT_0', env.LATITUDE ?? '');
        this.baseSunUrl = this.baseSunUrl.replace('ELEMENT_1', env.LONGITUDE ?? '');
    }

    /**
     * This function fetches weather data for the last 24 hours. This
     * data is returned in intervals of 5 minutes in a list.
     *
     * @returns A list of weather data for today.
     */
    public getWeatherData(): Promise<IWeatherData[]> {
        return this.serviceHelper.fetchList<IWeatherData>({
            url: this.baseStationUrl
        });
    }

    /**
     * This function fetches weather data for the last 24 hours of a
     * specified end date. This data is returned in intervals of 5 minutes in a list.
     *
     * @param endDate The day to fetch data for
     * @returns A list of weather data for today.
     */
    public getWeatherDataEndDate(endDate: Date): Promise<IWeatherData[]> {
        return this.serviceHelper.fetchList<IWeatherData>({
            url: `${this.baseStationUrl}&endDate=${endDate.getTime()}`
        });
    }

    /**
     * This function returns the solar data for today.
     *
     * @returns The solar data for today.
     */
    public getSunData(): Promise<ISunData> {
        return this.serviceHelper.fetch<ISunData>({
            url: this.baseSunUrl
        });
    }
}
