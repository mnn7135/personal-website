'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import { IWeatherConfig, loadWeatherConfig } from '@/services/configs/weather-config.service';

const weatherConfig: IWeatherConfig = loadWeatherConfig();
const config: IAppConfig = loadAppConfig();

export default function LiveRadarPage() {
    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.RADAR_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="p-2">
                <iframe
                    src={weatherConfig.LIVE_RADAR_URL}
                    className="h-150 w-full border border-r-8 border-solid"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin disallow-popups"
                ></iframe>
            </div>
        </div>
    );
}
