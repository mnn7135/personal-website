import IWeatherHelperService from '@/services/weather/weather-analysis.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import InfoCard from './info-card';
import { SmallPaddingBar } from './padding-bar';

interface WeatherCardProps {
    day: Date;
    icon: string;
    weatherDescription?: string;
    temperature: string;
    feelsLike?: string;
}

export default function WeatherCard(props: WeatherCardProps) {
    const helperService = new IWeatherHelperService();

    const monthNameLong = props.day.toLocaleString('en-US', {
        month: 'long'
    });
    const currentDay = props.day.toLocaleString('en-US', { day: 'numeric' });

    return (
        <InfoCard
            overhead={`${helperService.getDayStringFromNumber(props.day.getDay())}, ${monthNameLong} ${currentDay}`}
            icon={props.icon}
            scaleTitle={true}
            cardTitle={props.temperature}
            secondaryTitle={props.feelsLike}
            cardDescription={props.weatherDescription}
            center={true}
        ></InfoCard>
    );
}
