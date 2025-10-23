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
    const localToday = new Date();
    const localTodayString = localToday.toISOString().substring(0, 10);
    const response =
        await sql`SELECT date FROM public.weather_data WHERE DATE_TRUNC('day', date) = DATE(${localTodayString});`;

    if (response.length > 0) {
        const { date } = response[0];
        if (date) {
            return true;
        }
    }
    return false;
}

/**
 * A function that submits the weather data for today to the database, in UTC time.
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
                 daily_rainfall, 
                 solar_radiation, 
                 uv_index)
                VALUES 
                (${convertDateToLocalTime(data.date)}, 
                 ${data.tempf}, 
                 ${(data.baromabsin * config.INCHES_MERCURY_TO_MBAR_CONVERSION).toFixed(2)}, 
                 ${data.humidity},
                 ${data.dewPoint},
                 ${data.windspeedmph},
                 ${data.dailyrainin},
                 ${data.solarradiation},
                 ${data.uv});`;

    if (!response) {
        console.log('Error submitting weather data.');
    }

    return;
}

/**
 * A helper function that converts a UTC Timestamp to the System's Local Time.
 *
 * @param date The date to convert.
 */
function convertDateToLocalTime(date: Date): Date {
    return new Date(new Date(date).getTime());
}
