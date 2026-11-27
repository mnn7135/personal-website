'use client';

import InfoListCard from '@/components/personal-website/info-list-card';
import { SmallPaddingBar } from '@/components/personal-website/padding-bar';
import WeatherCard from '@/components/personal-website/weather-card';
import WeatherInfoListCard from '@/components/personal-website/weather-info-list-card';
import { useWeatherContext } from '@/components/providers/weatherDataProvider';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import { IWeatherForecast } from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();
const MS_IN_A_DAY = 86400000;

export default function WeatherPage() {
    const { liveWeatherData, predictionService, analysisService, sunData } = useWeatherContext();

    // Fetches and sets the prediction values for one, two, and three-day forecasts.
    const [oneDayPredict, setOneDayPredict] = useState<IWeatherForecast>();
    const [twoDayPredict, setTwoDayPredict] = useState<IWeatherForecast>();
    const [threeDayPredict, setThreeDayPredict] = useState<IWeatherForecast>();
    const [fourDayPredict, setFourDayPredict] = useState<IWeatherForecast>();
    const [fiveDayPredict, setFiveDayPredict] = useState<IWeatherForecast>();

    const todayWeatherData = liveWeatherData ? liveWeatherData[0] : null;
    const today = liveWeatherData
        ? liveWeatherData[0]
            ? new Date(liveWeatherData[0].date)
            : null
        : null;

    useEffect(() => {
        if (predictionService) {
            setOneDayPredict(predictionService.getTomorrowForecast());
            setTwoDayPredict(predictionService.getTwoDayForecast());
            setThreeDayPredict(predictionService.getThreeDayForecast());
            setFourDayPredict(predictionService.getFourDayForecast());
            setFiveDayPredict(predictionService.getFiveDayForecast());
        }
    }, [predictionService]);

    return (
        <div>
            <div className="p-2 text-left text-3xl font-bold">{config.WEATHER_TITLE}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            {analysisService ? (
                <div className="flex flex-row flex-wrap place-content-around">
                    {analysisService.getActiveAlerts().length > 0 ? (
                        <InfoListCard
                            cardTitle={'These are the active weather alerts:'}
                            stretch={true}
                            center={true}
                            data={analysisService?.getActiveAlerts()}
                            scaleDataText={true}
                        ></InfoListCard>
                    ) : (
                        <></>
                    )}
                </div>
            ) : (
                <></>
            )}
            <br></br>
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
            <br></br>
            <SmallPaddingBar></SmallPaddingBar>
            <div className="p-2 text-left text-3xl font-bold">{config.FORECAST_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={today ? new Date(today.getTime() + 1 * MS_IN_A_DAY) : new Date()}
                    icon={oneDayPredict?.condition ?? ''}
                    temperature={`${oneDayPredict?.temperatue ? Math.round(oneDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={oneDayPredict?.condition ?? 'Loading...'}
                    smallerCard={true}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 2 * MS_IN_A_DAY) : new Date()}
                    icon={twoDayPredict?.condition ?? ''}
                    temperature={`${twoDayPredict?.temperatue ? Math.round(twoDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={twoDayPredict?.condition ?? 'Loading...'}
                    smallerCard={true}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 3 * MS_IN_A_DAY) : new Date()}
                    icon={threeDayPredict?.condition ?? ''}
                    temperature={`${threeDayPredict?.temperatue ? Math.round(threeDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={threeDayPredict?.condition ?? 'Loading...'}
                    smallerCard={true}
                ></WeatherCard>
            </div>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <WeatherCard
                    day={today ? new Date(today.getTime() + 4 * MS_IN_A_DAY) : new Date()}
                    icon={fourDayPredict?.condition ?? ''}
                    temperature={`${fourDayPredict?.temperatue ? Math.round(fourDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={fourDayPredict?.condition ?? 'Loading...'}
                    smallerCard={true}
                ></WeatherCard>
                <WeatherCard
                    day={today ? new Date(today.getTime() + 5 * MS_IN_A_DAY) : new Date()}
                    icon={fiveDayPredict?.condition ?? ''}
                    temperature={`${fiveDayPredict?.temperatue ? Math.round(fiveDayPredict?.temperatue) : '-'} °F`}
                    weatherDescription={fiveDayPredict?.condition ?? 'Loading...'}
                    smallerCard={true}
                ></WeatherCard>
            </div>
            <br></br>
            <SmallPaddingBar></SmallPaddingBar>
            <div className="p-1 font-semibold">
                {`${config.LAST_MAINTENANCE} | `}
                {`${config.LAST_PULL_FROM} ${liveWeatherData ? (liveWeatherData[0] ? new Date(liveWeatherData[0].date).toLocaleString('en-US', { timeZone: 'America/New_York' }) : 'Fetching...') : null}`}
            </div>
        </div>
    );
}
