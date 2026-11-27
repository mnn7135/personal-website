'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();

export default function AboutPage() {
    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.ABOUT_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row">
                <div>
                    <div className="h-20 w-90"></div>
                </div>
                <div>
                    <div>{config.ABOUT_TEXT_ONE}</div>
                </div>
            </div>
            <br></br>
            <div className="flex flex-row">
                <div>
                    <div>{config.ABOUT_TEXT_TWO}</div>
                </div>
                <div>
                    <div className="h-20 w-90"></div>
                </div>
            </div>
        </div>
    );
}
