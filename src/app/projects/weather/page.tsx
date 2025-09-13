'use client';

import InfoCard from '@/components/personal-website/info-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import WeatherCard from '@/components/personal-website/weather-card';
import { WeatherChart } from '@/components/personal-website/weather-chart';
import WeatherInfoListCard from '@/components/personal-website/weather-info-list-card';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import IWeatherAnalysisService from '@/services/weather/weather-analysis.service';
import IWeatherDataService from '@/services/weather/weather-data.service';
import IWeatherPredictionService from '@/services/weather/weather-prediction.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData, IWeatherForecast } from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();
const DATA_FETCH_DELAY = 1000;
const MS_IN_A_DAY = 86400000;

export default function WeatherPage() {
    /** Fetch Weather Data */
    const [today, setToday] = useState<Date>();
    const [todayWeatherData, setTodayWeatherData] = useState<IWeatherData>();
    const weatherDataService = new IWeatherDataService();

    const [weatherData, setWeatherData] = useState<IWeatherData[]>();
    const [oneDayAgoWeatherData, setOneDayAgoWeatherData] = useState<IWeatherData[]>();
    const [twoDaysAgoWeatherData, setTwoDaysAgoWeatherData] = useState<IWeatherData[]>();
    const [threeDaysAgoWeatherData, setThreeDaysAgoWeatherData] = useState<IWeatherData[]>();

    const fetchWeatherData = async () => {
        setTimeout(async () => {
            const fetchedData = await weatherDataService.getWeatherData();
            setWeatherData(fetchedData);
            setToday(new Date(fetchedData[0].date));
            setTodayWeatherData(fetchedData[0]);
        }, DATA_FETCH_DELAY);
    };

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData();
        }
    });

    useEffect(() => {
        if (today) {
            const oneDayAgo = new Date(today.getTime() - 1 * MS_IN_A_DAY);

            setTimeout(async () => {
                setOneDayAgoWeatherData(await weatherDataService.getWeatherDataEndDate(oneDayAgo));
            }, DATA_FETCH_DELAY);
        }
    }, [today, weatherDataService]);

    useEffect(() => {
        if (today && oneDayAgoWeatherData) {
            const twoDaysAgo = new Date(today.getTime() - 2 * MS_IN_A_DAY);

            setTimeout(async () => {
                setTwoDaysAgoWeatherData(
                    await weatherDataService.getWeatherDataEndDate(twoDaysAgo)
                );
            }, DATA_FETCH_DELAY);
        }
    }, [today, oneDayAgoWeatherData, weatherDataService]);

    useEffect(() => {
        if (today && twoDaysAgoWeatherData) {
            const threeDaysAgo = new Date(today.getTime() - 3 * MS_IN_A_DAY);

            setTimeout(async () => {
                setThreeDaysAgoWeatherData(
                    await weatherDataService.getWeatherDataEndDate(threeDaysAgo)
                );
            }, DATA_FETCH_DELAY);
        }
    }, [today, twoDaysAgoWeatherData, weatherDataService]);

    /** Fetch Sun Data */
    const [sunData, setSunData] = useState<ISunDataResult>();
    const [analysisService, setAnalysisService] = useState<IWeatherAnalysisService>();

    const fetchSunData = async () => {
        setTimeout(async () => {
            const fetchedData = await weatherDataService.getSunData();
            setSunData(fetchedData.results);
        }, DATA_FETCH_DELAY);
    };

    useEffect(() => {
        if (!sunData) {
            fetchSunData();
        }
    });

    /** Fetch Weather Forecasts */
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
        if (
            weatherData &&
            oneDayAgoWeatherData &&
            twoDaysAgoWeatherData &&
            threeDaysAgoWeatherData &&
            sunData
        ) {
            setWeatherPredictionService(
                new IWeatherPredictionService(
                    weatherData,
                    oneDayAgoWeatherData,
                    twoDaysAgoWeatherData,
                    threeDaysAgoWeatherData,
                    sunData
                )
            );
        }
    }, [
        weatherData,
        oneDayAgoWeatherData,
        twoDaysAgoWeatherData,
        threeDaysAgoWeatherData,
        sunData
    ]);

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
                    day={today ? new Date(today.getTime() + 1 * MS_IN_A_DAY) : new Date()}
                    icon={oneDayPredict?.condition ?? ''}
                    temperature={`${oneDayPredict?.temperatue ? Math.round(oneDayPredict?.temperatue) : 0} °F`}
                    weatherDescription={oneDayPredict?.condition ?? ''}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 2 * MS_IN_A_DAY) : new Date()}
                    icon={twoDayPredict?.condition ?? ''}
                    temperature={`${twoDayPredict?.temperatue ? Math.round(twoDayPredict?.temperatue) : 0} °F`}
                    weatherDescription={twoDayPredict?.condition ?? ''}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 3 * MS_IN_A_DAY) : new Date()}
                    icon={threeDayPredict?.condition ?? ''}
                    temperature={`${threeDayPredict?.temperatue ? Math.round(threeDayPredict?.temperatue) : 0} °F`}
                    weatherDescription={threeDayPredict?.condition ?? ''}
                ></WeatherCard>
            </div>

            <div className="p-2 text-center text-2xl font-bold">{config.LIVE_DATA_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <WeatherChart
                chartData={
                    weatherData &&
                    oneDayAgoWeatherData &&
                    twoDaysAgoWeatherData &&
                    threeDaysAgoWeatherData
                        ? [
                              ...weatherData,
                              ...oneDayAgoWeatherData,
                              ...twoDaysAgoWeatherData,
                              ...threeDaysAgoWeatherData
                          ]
                        : []
                }
            />
        </div>
    );
}
