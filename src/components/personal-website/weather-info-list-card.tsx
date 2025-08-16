import { IWeatherData } from '@/types/weather/weather-data.domain';
import InfoListCard from './info-list-card';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import IWeatherHelperService from '@/services/weather/weather-helper.service';

interface WeatherInfoListCardProps {
    cardTitle?: string;
    weatherData: IWeatherData;
    sunData: ISunDataResult;
    dataLabels: string[];
}

export default function WeatherInfoListCard(props: WeatherInfoListCardProps) {
    const weatherDataDisplay: string[] = [];
    const helperService = new IWeatherHelperService();

    if (props.sunData && props.weatherData) {
        weatherDataDisplay.push(new Date(props.sunData.sunrise).toLocaleTimeString()); // Sunrise
        weatherDataDisplay.push(new Date(props.sunData.sunset).toLocaleTimeString()); // Sunset
        weatherDataDisplay.push(Math.round(props.weatherData.windspdmph_avg10m) + ' mph'); // Wind
        weatherDataDisplay.push(
            helperService.getPressureInMbar(props.weatherData.baromabsin) + ' mbar'
        ); // Pressure
        weatherDataDisplay.push(Math.round(props.weatherData.windgustmph) + ' mph'); // Wind Gusts
        weatherDataDisplay.push(helperService.getUVRisk(props.weatherData.uv)); // UV Index
        weatherDataDisplay.push(props.weatherData.humidity + '%'); // Humidity
        weatherDataDisplay.push(props.weatherData.hourlyrainin + ' in'); // Hourly Rainfall
        weatherDataDisplay.push(Math.round(props.weatherData.dewPoint) + ' °F'); // Dew Point
    }

    return (
        <InfoListCard
            dataLabels={props.dataLabels}
            data={weatherDataDisplay}
            cardTitle={props.cardTitle ?? ''}
            center={false}
            stretch={true}
        ></InfoListCard>
    );
}
