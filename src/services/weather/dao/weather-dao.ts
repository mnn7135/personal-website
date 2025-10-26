'use server';

import { IWeatherConfig, loadWeatherConfig } from '@/services/configs/weather-config.service';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { neon } from '@neondatabase/serverless';

const config: IWeatherConfig = loadWeatherConfig();
const sql = neon(process.env.DATABASE_URL ?? '');

/**
 * A function that checks if the weather data for today has been submitted.
 *
 * @returns True if the weather data for today has been submitted.
 */
export async function getHasSubmittedTodayData(): Promise<boolean> {
    const localToday = convertDateToLocalTimestamp(new Date()).split(',')[0];
    const response =
        await sql`SELECT date FROM public.weather_data WHERE DATE_TRUNC('day', date) = DATE(${localToday});`;

    if (response.length > 0) {
        const { date } = response[0];
        if (date) {
            return true;
        }
    }
    return false;
}

/**
 * A function that fetches the weather data history that has been submitted to the database.
 *
 * @returns A list of weather data objects from previous recorded days.
 */
export async function getWeatherHistoryData(): Promise<IWeatherData[]> {
    const weatherHistory: IWeatherData[] = [];
    const response = await sql`SELECT * FROM public.weather_data;`;

    if (response.length > 0) {
        for (const row of response) {
            weatherHistory.push({
                baromabsin: Number(row.pressure),
                tempf: Number(row.temperature),
                humidity: Number(row.humidity),
                windspdmph_avg10m: Number(row.wind_speed),
                winddir_avg10m: Number(row.wind_direction),
                dailyrainin: Number(row.daily_rainfall),
                solarradiation: Number(row.solar_radiation),
                uv: row.uv_index,
                dewPoint: Number(row.dew_point),
                date: adjustTimeForDeployment(row.date)
            });
        }
    }

    return weatherHistory;
}

/**
 * A function that submits the weather data for today to the database, in Local time.
 *
 * @param data The weather data for today to submit.
 */
export async function postTodayData(data: IWeatherData): Promise<void> {
    const response = await sql`INSERT INTO public.weather_data
                (date, 
                 temperature, 
                 pressure, 
                 humidity, 
                 dew_point, 
                 wind_speed,
                 wind_direction, 
                 daily_rainfall, 
                 solar_radiation, 
                 uv_index)
                VALUES 
                (${convertDateToLocalTimestamp(data.date)}, 
                 ${data.tempf}, 
                 ${(data.baromabsin * config.INCHES_MERCURY_TO_MBAR_CONVERSION).toFixed(2)}, 
                 ${data.humidity},
                 ${data.dewPoint},
                 ${data.windspdmph_avg10m},
                 ${data.winddir_avg10m},
                 ${data.dailyrainin},
                 ${data.solarradiation},
                 ${data.uv});`;

    if (!response) {
        console.log('Error submitting weather data.');
    }

    return;
}

/**
 * A helper function that converts a Local Date to Eastern Time as a Timestamp.
 *
 * @param date The date to convert.
 */
function convertDateToLocalTimestamp(date: Date): string {
    return new Date(date).toLocaleString('en-US', { timeZone: 'America/New_York' });
}

/**
 * A helper function that adjusts the time correctly when used on the Vercel deployment.
 * TODO: Find a better way to handle time discrepancy of 4 hours.
 *
 * @param date The date to convert.
 */
function adjustTimeForDeployment(date: Date): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setHours(adjustedDate.getHours() + 4);
    return adjustedDate;
}
