'use client';

import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import WeatherCard from '@/components/personal-website/weather-card';
import { WeatherChart } from '@/components/personal-website/weather-chart';
import WeatherInfoListCard from '@/components/personal-website/weather-info-list-card';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import IWeatherAnalysisService from '@/services/weather/weather-analysis.service';
import IWeatherDataService from '@/services/weather/weather-data.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();
const DATA_FETCH_DELAY = 1000;

export default function WeatherPage() {
    const [todayWeatherData, setTodayWeatherData] = useState<IWeatherData>();
    const [weatherData, setWeatherData] = useState<IWeatherData[]>();
    const [sunData, setSunData] = useState<ISunDataResult>();
    const [analysisService, setAnalysisService] = useState<IWeatherAnalysisService>();

    const fetchWeatherData = async () => {
        setTimeout(async () => {
            const weatherService = new IWeatherDataService();
            const fetchedData = await weatherService.getWeatherData();
            setWeatherData(fetchedData);
        }, DATA_FETCH_DELAY);
    };

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData();
        }
    }, []);

    useEffect(() => {
        if (weatherData) {
            setTodayWeatherData(weatherData[0]);
        }
    }, [weatherData]);

    useEffect(() => {
        if (weatherData && sunData) {
            setAnalysisService(new IWeatherAnalysisService(weatherData, sunData));
        }
    }, [weatherData, sunData]);

    const fetchSunData = async () => {
        setTimeout(async () => {
            const weatherService = new IWeatherDataService();
            const fetchedData = await weatherService.getSunData();
            setSunData(fetchedData.results);
        }, DATA_FETCH_DELAY);
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
            {analysisService?.getActiveAlerts() ? (
                <div className="flex flex-row flex-wrap place-content-around">
                    <InfoCard
                        stretch={true}
                        center={true}
                        cardTitle={analysisService?.getActiveAlerts()}
                    ></InfoCard>
                </div>
            ) : (
                <></>
            )}
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={todayWeatherData?.date ? new Date(todayWeatherData?.date) : new Date()}
                    icon={analysisService?.getCurrentWeatherCondition() ?? ''}
                    temperature={Math.round(todayWeatherData?.tempf ?? 0) + ' °F'}
                    feelsLike={'Feels like ' + Math.round(todayWeatherData?.feelsLike ?? 0) + ' °F'}
                    weatherDescription={analysisService?.getCurrentWeatherCondition()}
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
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={
                        todayWeatherData?.date
                            ? new Date(
                                  new Date(todayWeatherData?.date).setDate(
                                      new Date(todayWeatherData?.date).getDate() + 1
                                  )
                              )
                            : new Date()
                    }
                    icon={''}
                    temperature={Math.round(0) + ' °F'}
                    weatherDescription={''}
                ></WeatherCard>
                <WeatherCard
                    day={
                        todayWeatherData?.date
                            ? new Date(
                                  new Date(todayWeatherData?.date).setDate(
                                      new Date(todayWeatherData?.date).getDate() + 2
                                  )
                              )
                            : new Date()
                    }
                    icon={''}
                    temperature={Math.round(0) + ' °F'}
                    weatherDescription={''}
                ></WeatherCard>
                <WeatherCard
                    day={
                        todayWeatherData?.date
                            ? new Date(
                                  new Date(todayWeatherData?.date).setDate(
                                      new Date(todayWeatherData?.date).getDate() + 3
                                  )
                              )
                            : new Date()
                    }
                    icon={''}
                    temperature={Math.round(0) + ' °F'}
                    weatherDescription={''}
                ></WeatherCard>
            </div>

            <div className="p-2 text-center text-2xl font-bold">{config.LIVE_DATA_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <WeatherChart chartData={weatherData} />
        </div>
    );
}
