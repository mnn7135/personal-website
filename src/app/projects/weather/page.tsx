'use client';

import InfoCard from '@/components/personal-website/info-card';
import InfoListCard from '@/components/personal-website/info-list-card';
import { PaddingBar, SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import IWeatherDataService from '@/services/weather/weather-data.service';
import { IWeatherData } from '@/types/weather/weather-data.domain';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();

export default function WeatherPage() {
    const [weatherData, setWeatherData] = useState<IWeatherData>();

    const fetchWeatherData = async () => {
        const weatherService = new IWeatherDataService();
        const fetchedData = await weatherService.getWeatherData();
        setWeatherData(fetchedData[0]);
    };

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData();
        }
    }, []);

    return (
        <div>
            <div className="p-2 text-3xl">{config.WEATHER_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="p-2 text-center text-2xl">{config.RIGHT_NOW_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <InfoCard
                    cardTitle={config.PROJECT_1_TITLE}
                    secondaryTitle={config.PROJECT_1_SKILLS}
                    cardDescription={config.PROJECT_1_DESCRIPTION}
                    center={true}
                ></InfoCard>
            </div>
            <br></br>
            <div className="p-2 text-center text-2xl">{config.RIGHT_NOW_CONDITIONS_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <InfoListCard dataLabels={config.WEATHER_DATA_LABELS_LIST} data={[]}></InfoListCard>
            </div>
            <div className="p-2 text-center text-2xl">{config.FORECAST_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-between">
                <InfoCard
                    cardTitle={config.PROJECT_1_TITLE}
                    secondaryTitle={config.PROJECT_1_SKILLS}
                    cardDescription={config.PROJECT_1_DESCRIPTION}
                    center={true}
                ></InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_2_TITLE}
                    secondaryTitle={config.PROJECT_2_SKILLS}
                    cardDescription={config.PROJECT_2_DESCRIPTION}
                    center={true}
                ></InfoCard>
                <InfoCard
                    cardTitle={config.PROJECT_3_TITLE}
                    secondaryTitle={config.PROJECT_3_SKILLS}
                    cardDescription={config.PROJECT_3_DESCRIPTION}
                    center={true}
                ></InfoCard>
            </div>

            <div className="p-2 text-center text-2xl">{config.LIVE_DATA_SECTION}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
        </div>
    );
}
