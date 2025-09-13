import { ISunData } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { AxiosServiceHelper } from '../axios/axios-helper.service';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import moment from 'moment';

export default class IWeatherDataService {
    private readonly serviceHelper: AxiosServiceHelper;
    private config: IWeatherConfig = loadWeatherConfig();

    private baseStationUrl: string = '';
    private baseSunUrl: string = '';

    constructor() {
        this.serviceHelper = new AxiosServiceHelper();

        // Weather Station URL
        this.baseStationUrl = this.config.BASE_STATION_URL.replace(
            'DEVICE_KEY',
            process.env.NEXT_PUBLIC_DEVICE_MAC_ADDRESS!
        );
        this.baseStationUrl = this.baseStationUrl.replace(
            'API_KEY',
            process.env.NEXT_PUBLIC_API_KEY!
        );
        this.baseStationUrl = this.baseStationUrl.replace(
            'APP_KEY',
            process.env.NEXT_PUBLIC_APPLICATION_KEY!
        );

        // Sun Data URL
        this.baseSunUrl = this.config.BASE_SUN_URL.replace(
            'LATITUDE',
            process.env.NEXT_PUBLIC_LATITUDE!
        );
        this.baseSunUrl = this.baseSunUrl.replace('LONGITUDE', process.env.NEXT_PUBLIC_LONGITUDE!);
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
        endDate.setFullYear(new Date().getFullYear());
        return this.serviceHelper.fetchList<IWeatherData>({
            url: `${this.baseStationUrl}&endDate=${moment(endDate).format()}`
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
