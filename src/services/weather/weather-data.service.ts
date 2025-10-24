'use server';

import { ISunData } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { AxiosServiceHelper } from '../axios/axios-helper.service';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import moment from 'moment';
import { getHasSubmittedTodayData, getWeatherHistoryData, postTodayData } from './dao/weather-dao';

const serviceHelper: AxiosServiceHelper = new AxiosServiceHelper();
const config: IWeatherConfig = loadWeatherConfig();

let baseStationUrl: string = '';
let baseSunUrl: string = '';

// Weather Station URL
baseStationUrl = config.BASE_STATION_URL.replace(
    'DEVICE_KEY',
    process.env.STATION_DEVICE_MAC_ADDRESS!
);
baseStationUrl = baseStationUrl.replace('API_KEY', process.env.STATION_API_KEY!);
baseStationUrl = baseStationUrl.replace('APP_KEY', process.env.STATION_APPLICATION_KEY!);

// Sun Data URL
baseSunUrl = config.BASE_SUN_URL.replace('LATITUDE', process.env.SYSTEM_LATITUDE!);
baseSunUrl = baseSunUrl.replace('LONGITUDE', process.env.SYSTEM_LONGITUDE!);

/**
 * This function fetches weather data for the last 24 hours. This
 * data is returned in intervals of 5 minutes in a list.
 *
 * @returns A list of weather data for today.
 */
export async function getWeatherData(): Promise<IWeatherData[]> {
    return serviceHelper.fetchList<IWeatherData>({
        url: baseStationUrl
    });
}

/**
 * This function fetches weather data for the last 24 hours of a
 * specified end date. This data is returned in intervals of 5 minutes in a list.
 *
 * @param endDate The day to fetch data for
 * @returns A list of weather data for today.
 */
export async function getWeatherDataEndDate(endDate: Date): Promise<IWeatherData[]> {
    endDate.setFullYear(new Date().getFullYear());
    return serviceHelper.fetchList<IWeatherData>({
        url: `${baseStationUrl}&endDate=${moment(endDate).format()}`
    });
}

/**
 * This function returns the solar data for today.
 *
 * @returns The solar data for today.
 */
export async function getSunData(): Promise<ISunData> {
    return serviceHelper.fetch<ISunData>({
        url: baseSunUrl
    });
}

/**
 * A function that checks if the weather data for today has been submitted.
 *
 * @returns True if the weather data for today has been submitted.
 */
export async function hasSubmittedWeatherToday(): Promise<boolean> {
    return getHasSubmittedTodayData();
}

/**
 * A function that submits the weather data for today to the database.
 *
 * @param data The weather data for today to submit.
 */
export async function postTodayWeatherData(data: IWeatherData): Promise<void> {
    postTodayData(data);
}

/**
 * A function that fetches the weather data history that has been submitted to the database.
 *
 * @returns A list of weather data objects from previous recorded days.
 */
export async function getWeatherHistory(): Promise<IWeatherData[]> {
    return getWeatherHistoryData();
}
