'use client';

import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import WeatherCard from '@/components/personal-website/weather-card';
import { WeatherChart } from '@/components/personal-website/weather-chart';
import WeatherInfoListCard from '@/components/personal-website/weather-info-list-card';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import IWeatherAnalysisService from '@/services/weather/weather-analysis.service';
import {
    getSunData,
    getWeatherData,
    getWeatherDataHistory,
    hasSubmittedWeatherToday,
    postTodayWeatherData
} from '@/services/weather/weather-data.service';
import IWeatherPredictionService from '@/services/weather/weather-prediction.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import {
    IWeatherData,
    IWeatherDataHistory,
    IWeatherForecast
} from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();
const MS_IN_A_DAY = 86400000;

export default function WeatherPage() {
    // Fetches and sets the current day, today's weather data, and the current weather right now.
    const [weatherData, setWeatherData] = useState<IWeatherData[]>();
    const [todayWeatherData, setTodayWeatherData] = useState<IWeatherData>();
    const [today, setToday] = useState<Date>();

    const fetchWeatherData = async () => {
        const fetchedData = await getWeatherData();
        setWeatherData(fetchedData);
        setToday(new Date(fetchedData[0].date));
        setTodayWeatherData(fetchedData[0]);
    };

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData();
        }
    });

    // Fetches and sets if the database has received data for today.
    const [hasSubmittedData, setHasSubmittedData] = useState<boolean>();

    const fetchHasTodayData = async () => {
        const isDataSubmitted = await hasSubmittedWeatherToday();
        setHasSubmittedData(isDataSubmitted);
    };

    useEffect(() => {
        if (!hasSubmittedData) {
            fetchHasTodayData();
        }
    });

    // Submits today's weather data to the database.
    const submitTodayData = async () => {
        if (todayWeatherData && !hasSubmittedData) {
            setHasSubmittedData(true);
            await postTodayWeatherData(todayWeatherData);
        }
    };

    // Fetches and sets the weather data history.
    const [weatherDataHistory, setWeatherDataHistory] = useState<IWeatherDataHistory>();

    const fetchWeatherDataHistory = async () => {
        const weatherHistory = await getWeatherDataHistory();
        setWeatherDataHistory(weatherHistory);
    };

    useEffect(() => {
        if (!weatherDataHistory) {
            fetchWeatherDataHistory();
        }
    }, [today]);

    // Fetches and sets the sun data for today.
    const [sunData, setSunData] = useState<ISunDataResult>();
    const [analysisService, setAnalysisService] = useState<IWeatherAnalysisService>();

    const fetchSunData = async () => {
        const fetchedData = await getSunData();
        setSunData(fetchedData.results);
    };

    useEffect(() => {
        if (!sunData) {
            fetchSunData();
        }
    });

    // Fetches and sets the prediction values for one, two, and three-day forecasts.
    const [oneDayPredict, setOneDayPredict] = useState<IWeatherForecast>();
    const [twoDayPredict, setTwoDayPredict] = useState<IWeatherForecast>();
    const [threeDayPredict, setThreeDayPredict] = useState<IWeatherForecast>();

    const [weatherPredictionService, setWeatherPredictionService] =
        useState<IWeatherPredictionService>();

    useEffect(() => {
        if (weatherPredictionService) {
            setOneDayPredict(weatherPredictionService.getTomorrowForecast());
            setTwoDayPredict(weatherPredictionService.getTwoDayForecast());
            setThreeDayPredict(weatherPredictionService.getThreeDayForecast());
        }
    }, [weatherPredictionService]);

    useEffect(() => {
        if (weatherData && sunData) {
            setAnalysisService(new IWeatherAnalysisService(weatherData, sunData));
        }
    }, [weatherData, sunData]);

    useEffect(() => {
        if (weatherData && weatherDataHistory && sunData) {
            setWeatherPredictionService(
                new IWeatherPredictionService(weatherData, weatherDataHistory, sunData)
            );
        }
    }, [weatherData, weatherDataHistory, sunData]);

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
                    temperature={`${todayWeatherData?.tempf ? Math.round(todayWeatherData?.tempf) : '-'} °F`}
                    feelsLike={`Feels like ${todayWeatherData?.feelsLike ? Math.round(todayWeatherData?.feelsLike) : '-'} °F`}
                    weatherDescription={
                        analysisService?.getCurrentWeatherCondition() ?? 'Loading...'
                    }
                ></WeatherCard>
            </div>
            <br></br>
            <div className="p-2 text-center text-2xl font-bold">{config.FORECAST_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={today ? new Date(today.getTime() + 1 * MS_IN_A_DAY) : new Date()}
                    icon={oneDayPredict?.condition ?? ''}
                    temperature={`${oneDayPredict?.temperatue ? Math.round(oneDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={oneDayPredict?.condition ?? 'Loading...'}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 2 * MS_IN_A_DAY) : new Date()}
                    icon={twoDayPredict?.condition ?? ''}
                    temperature={`${twoDayPredict?.temperatue ? Math.round(twoDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={twoDayPredict?.condition ?? 'Loading...'}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 3 * MS_IN_A_DAY) : new Date()}
                    icon={threeDayPredict?.condition ?? ''}
                    temperature={`${threeDayPredict?.temperatue ? Math.round(threeDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={threeDayPredict?.condition ?? 'Loading...'}
                ></WeatherCard>
            </div>
            <div className="p-2 text-center text-2xl font-bold">
                {config.RIGHT_NOW_CONDITIONS_SECTION}
            </div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                {sunData && todayWeatherData ? (
                    <WeatherInfoListCard
                        dataLabels={config.WEATHER_DATA_LABELS_LIST}
                        weatherData={todayWeatherData}
                        sunData={sunData}
                    ></WeatherInfoListCard>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div className="flex flex-col flex-wrap place-content-around p-4 text-center">
                <Button
                    disabled={hasSubmittedData ? hasSubmittedData : weatherData ? false : true}
                    onClick={submitTodayData}
                >
                    {" Submit Today's Data"}
                </Button>
                {hasSubmittedData ? (
                    <div className="text-red-600">Data already submitted for today.</div>
                ) : (
                    <></>
                )}
            </div>
            <div className="p-2 text-center text-2xl font-bold">{config.LIVE_DATA_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            {weatherData && weatherDataHistory ? (
                <WeatherChart
                    chartData={[
                        ...weatherData,
                        ...weatherDataHistory.yesterday,
                        ...weatherDataHistory.twoDays,
                        ...weatherDataHistory.threeDays
                    ]}
                />
            ) : (
                <div className="p-2 text-center text-2xl">Loading...</div>
            )}
        </div>
    );
}
