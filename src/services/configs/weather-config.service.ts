import { env } from 'process';
import weatherConfig from './json/weather-config.json';

export interface IWeatherConfig {
    // Data Configuration
    BASE_STATION_URL: string;
    BASE_SUN_URL: string;

    // Cardinal Directions
    NORTH: string;
    SOUTH: string;
    EAST: string;
    WEST: string;

    // UV Risk Factors
    LOW_UV_RISK: string;
    MODERATE_UV_RISK: string;
    HIGH_UV_RISK: string;
    VERY_HIGH_UV_RISK: string;
    EXTREME_UV_RISK: string;

    // Warnings and Advisories
    WIND_ADVISORY: string;
    HIGH_WIND_WARNING: string;
    HEAT_ADVISORY: string;
    EXCESSIVE_HEAT_WARNING: string;
    WIND_CHILL_WARNING: string;
    WIND_CHILL_ADVISORY: string;
    SEVERE_THUNDERSTORM_WARNING: string;
    FLASH_FLOOD_WARNING: string;
    BLIZZARD_WARNING: string;
    NO_ALERTS: string;

    // Conversions
    INCHES_MERCURY_TO_MBAR_CONVERSION: number;

    // Weather Conditions
    WEATHER_SUNNY: string;
    WEATHER_CLOUDS: string;
    WEATHER_PARTLY_CLOUDS: string;
    WEATHER_STORM: string;
    WEATHER_RAIN: string;
    WEATHER_SNOW: string;
    WEATHER_CLEAR: string;
    WEATHER_WIND: string;
    WEATHER_FOG: string;
    WEATHER_BREEZE: string;
}

export function loadWeatherConfig(): IWeatherConfig {
    console.log('Loaded the Weather Config.');

    return weatherConfig as IWeatherConfig;
}
