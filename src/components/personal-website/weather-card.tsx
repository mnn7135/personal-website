import IWeatherHelperService from '@/services/weather/weather-helper.service';
import InfoCard from './info-card';
import { loadWeatherConfig } from '@/services/configs/weather-config.service';
import {
    CloudFogIcon,
    CloudLightning,
    CloudRainIcon,
    CloudSnowIcon,
    CloudyIcon,
    MoonStarIcon,
    SunIcon,
    WindIcon
} from 'lucide-react';
import { JSX } from 'react';

interface WeatherCardProps {
    day: Date;
    icon: string;
    weatherDescription?: string;
    temperature: string;
    feelsLike?: string;
}

export default function WeatherCard(props: WeatherCardProps): JSX.Element {
    const config = loadWeatherConfig();
    const helperService: IWeatherHelperService = new IWeatherHelperService();

    const WEATHER_ICON_SIZE = 192;

    // A helper function to get the correct icon for the weather condition.
    function getWeatherIcon(weatherCondition: string) {
        switch (weatherCondition) {
            case config.WEATHER_SUNNY:
                return <SunIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_CLOUDS:
                return <CloudyIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_PARTLY_CLOUDS:
                return <CloudyIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_STORM:
                return <CloudLightning size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_RAIN:
                return <CloudRainIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_SNOW:
                return <CloudSnowIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_CLEAR:
                return <MoonStarIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_WIND:
                return <WindIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_FOG:
                return <CloudFogIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_BREEZE:
                return <WindIcon size={WEATHER_ICON_SIZE} />;
        }
    }

    const monthNameLong = props.day.toLocaleString('en-US', {
        month: 'long'
    });
    const currentDay = props.day.toLocaleString('en-US', { day: 'numeric' });

    return (
        <InfoCard
            overhead={`${helperService.getDayStringFromNumber(props.day.getDay())}, ${monthNameLong} ${currentDay}`}
            icon={getWeatherIcon(props.icon)}
            scaleTitle={true}
            cardTitle={props.temperature}
            secondaryTitle={props.feelsLike}
            cardDescription={props.weatherDescription}
            scaleDescription={true}
            center={true}
        ></InfoCard>
    );
}
