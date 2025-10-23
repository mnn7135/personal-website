'use server';

import { ISunData } from '@/types/weather/sun-data.domain';
import { IWeatherData, IWeatherDataHistory } from '@/types/weather/weather-data.domain';
import { AxiosServiceHelper } from '../axios/axios-helper.service';
import { IWeatherConfig, loadWeatherConfig } from '../configs/weather-config.service';
import moment from 'moment';
import { getHasSubmittedTodayData, postTodayData } from './dao/weather-dao';

const serviceHelper: AxiosServiceHelper = new AxiosServiceHelper();
const config: IWeatherConfig = loadWeatherConfig();
const DATA_FETCH_DELAY = 1250;
const MS_IN_A_DAY = 86400000;

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
async function getWeatherDataEndDate(endDate: Date): Promise<IWeatherData[]> {
    endDate.setFullYear(new Date().getFullYear());
    return serviceHelper.fetchList<IWeatherData>({
        url: `${baseStationUrl}&endDate=${moment(endDate).format()}`
    });
}

export async function getWeatherDataHistory(): Promise<IWeatherDataHistory> {
    const today = new Date();
    const oneDayAgo = new Date(today.getTime() - 1 * MS_IN_A_DAY);
    const twoDaysAgo = new Date(today.getTime() - 2 * MS_IN_A_DAY);
    const threeDaysAgo = new Date(today.getTime() - 3 * MS_IN_A_DAY);

    await delay(DATA_FETCH_DELAY);
    const yesterdayData = await getWeatherDataEndDate(oneDayAgo);

    await delay(DATA_FETCH_DELAY);
    const twoDaysData = await getWeatherDataEndDate(twoDaysAgo);

    await delay(DATA_FETCH_DELAY);
    const threeDaysData = await getWeatherDataEndDate(threeDaysAgo);

    return {
        yesterday: yesterdayData,
        twoDays: twoDaysData,
        threeDays: threeDaysData
    };
}

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
