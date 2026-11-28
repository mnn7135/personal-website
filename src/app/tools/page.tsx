'use client';

import { SmallPaddingBar } from '@/components/personal-website/padding-bar';
import { useWeatherContext } from '@/components/providers/weatherDataProvider';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import { postTodayWeatherData } from '@/services/weather/weather-data.service';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();

export default function DataGraphsPage() {
    const { liveWeatherData, submittedToday } = useWeatherContext();
    const todayWeatherData = liveWeatherData ? liveWeatherData[0] : null;

    // Fetches and sets if the database has received data for today.
    const [hasSubmittedData, setHasSubmittedData] = useState<boolean>(true);

    // Submits today's weather data to the database.
    const submitTodayData = async () => {
        if (todayWeatherData && !submittedToday) {
            setHasSubmittedData(true);
            await postTodayWeatherData(todayWeatherData);
        }
    };

    useEffect(() => {
        if (submittedToday != null) {
            setHasSubmittedData(submittedToday);
        }
    }, [submittedToday]);

    return (
        <div>
            <div className="p-2 text-left text-3xl font-bold">{config.TOOLS_TITLE}</div>
            <SmallPaddingBar></SmallPaddingBar>
            <br></br>
            <div className="flex flex-col flex-wrap place-content-around p-4 text-center">
                <Button disabled={hasSubmittedData || !todayWeatherData} onClick={submitTodayData}>
                    {config.TOOLS_SUBMIT_BUTTON_TEXT}
                </Button>
                {hasSubmittedData ? (
                    <div className="text-red-600">{config.TOOLS_ALERT_TEXT}</div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
