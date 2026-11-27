'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';

const config: IAppConfig = loadAppConfig();
const IMAGE_HEIGHT = 500;
const IMAGE_WIDTH = 1000;

export default function ContactPage() {
    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.CONTACT_TITLE}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row">
                <div>
                    <div className="h-40 w-90"></div>
                </div>
                <div>
                    <div>{config.CONTACT_TEXT}</div>
                </div>
            </div>
            <div className="p-2 text-3xl font-bold">{config.CONTACT_TITLE_SUBMIT_STATION}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-col">
                <div>
                    <div>{config.CONTACT_TEXT_SUBMIT_STATION}</div>
                </div>
                <div className="flex flex-row">
                    <div className="h-40 w-90"></div>
                    <Button variant={'outline'}>{config.CONTACT_SUBMIT_BUTTON_TEXT}</Button>
                </div>
            </div>
        </div>
    );
}
