'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function HomePage() {
    return (
        <div>
            <div className="-m-3 h-80 border-3 border-blue-500 bg-blue-400">
                <div className="m-12 flex flex-col">
                    <div className="text-6xl font-bold text-white">{config.HOME_TITLE_TOP}</div>
                    <div className="text-6xl font-bold text-blue-800">{config.HOME_TITLE_MID}</div>
                    <div className="text-6xl font-bold text-orange-600">
                        {config.HOME_TITLE_BTM}
                    </div>
                </div>
            </div>
            <br></br>
            <div className="p-2 text-3xl font-bold">{config.HOME_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row">
                <div>
                    <div>{config.HOME_TEXT_ONE}</div>
                    <br></br>
                    <div>{config.HOME_TEXT_TWO}</div>
                </div>
                <div>
                    <div className="h-40 w-90"></div>
                </div>
            </div>
        </div>
    );
}
