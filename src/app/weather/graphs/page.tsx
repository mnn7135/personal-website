'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { WeatherChart } from '@/components/personal-website/weather-chart';
import { useWeatherContext } from '@/components/providers/weatherDataProvider';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function DataGraphsPage() {
    const { liveWeatherData, historicalWeatherData } = useWeatherContext();

    return (
        <div>
            <div className="flex flex-row">
                <div className="mt-1.5 pr-2 font-bold">{config.WEATHER_GRAPHS_LOCATION_TEXT}</div>
                <Button variant={'outline'}>{config.WEATHER_GRAPHS_LOCATION}</Button>
            </div>
            <PaddingBar></PaddingBar>
            <div className="p-2 text-3xl font-bold">{config.WEATHER_GRAPHS_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <WeatherChart
                liveData={liveWeatherData ?? []}
                historicalData={historicalWeatherData ?? []}
            />
        </div>
    );
}
