'use client';

import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import WeatherCard from '@/components/personal-website/weather-card';
import { WeatherChart } from '@/components/personal-website/weather-chart';
import WeatherInfoListCard from '@/components/personal-website/weather-info-list-card';
import { ChartLineDefault } from '@/components/ui/chart-line-default';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import IWeatherDataService from '@/services/weather/weather-data.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();

export default function WeatherPage() {
    const [todayWeatherData, setTodayWeatherData] = useState<IWeatherData>();
    const [weatherData, setWeatherData] = useState<IWeatherData[]>();
    const [sunData, setSunData] = useState<ISunDataResult>();

    const fetchWeatherData = async () => {
        const weatherService = new IWeatherDataService();
        const fetchedData = await weatherService.getWeatherData();
        setTodayWeatherData(fetchedData[0]);
        setWeatherData(fetchedData);
    };

    useEffect(() => {
        if (!todayWeatherData && !weatherData) {
            fetchWeatherData();
        }
    }, []);

    const fetchSunData = async () => {
        const weatherService = new IWeatherDataService();
        const fetchedData = await weatherService.getSunData();
        setSunData(fetchedData.results);
    };

    useEffect(() => {
        if (!sunData) {
            fetchSunData();
        }
    }, []);

    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.WEATHER_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="p-2 text-center text-2xl font-bold">{config.RIGHT_NOW_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={new Date(todayWeatherData?.date ?? '')}
                    icon={' [here]'}
                    temperature={Math.round(todayWeatherData?.tempf ?? 0) + ' °F'}
                    feelsLike={'Feels like ' + Math.round(todayWeatherData?.feelsLike ?? 0) + ' °F'}
                    weatherDescription={'d'}
                ></WeatherCard>
            </div>
            <br></br>
            <div className="p-2 text-center text-2xl font-bold">
                {config.RIGHT_NOW_CONDITIONS_SECTION}
            </div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherInfoListCard
                    dataLabels={config.WEATHER_DATA_LABELS_LIST}
                    weatherData={todayWeatherData!}
                    sunData={sunData!}
                ></WeatherInfoListCard>
            </div>
            <div className="p-2 text-center text-2xl font-bold">{config.FORECAST_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-between">
                <WeatherCard
                    day={new Date(todayWeatherData?.date ?? '')}
                    icon={' [here]'}
                    temperature={Math.round(todayWeatherData?.tempf ?? 0) + ' °F'}
                    weatherDescription={'d'}
                ></WeatherCard>
                <WeatherCard
                    day={new Date(todayWeatherData?.date ?? '')}
                    icon={' [here]'}
                    temperature={Math.round(todayWeatherData?.tempf ?? 0) + ' °F'}
                    weatherDescription={'d'}
                ></WeatherCard>
                <WeatherCard
                    day={new Date(todayWeatherData?.date ?? '')}
                    icon={' [here]'}
                    temperature={Math.round(todayWeatherData?.tempf ?? 0) + ' °F'}
                    weatherDescription={'d'}
                ></WeatherCard>
            </div>

            <div className="p-2 text-center text-2xl font-bold">{config.LIVE_DATA_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <WeatherChart chartData={weatherData} />
        </div>
    );
}
