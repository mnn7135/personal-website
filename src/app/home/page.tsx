'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const config: IAppConfig = loadAppConfig();
const BUTTON_SCALE = '1/4';

export default function HomePage() {
    const [imageSize, setImageSize] = useState<number>(225);
    const [lastWindowSize, setLastWindowSize] = useState<number>();

    useEffect(() => {
        if (window.innerWidth != lastWindowSize) {
            setImageSize((window.innerWidth / 1920) * 225);
        }

        setLastWindowSize(window.innerWidth);
    }, [lastWindowSize]);

    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.QUCIK_LINKS_SECTION}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <Button
                    onClick={() => window.open(config.STACK_OVERFLOW_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    <Image
                        src={config.STACK_OVERFLOW_IMG_SRC}
                        alt={config.STACK_OVERFLOW_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.GIT_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.GIT_IMG_SRC}
                        alt={config.GIT_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.RIT_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.RIT_IMG_SRC}
                        alt={config.RIT_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.LINKEDIN_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.LINKEDIN_IMG_SRC}
                        alt={config.LINKEDIN_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
            </div>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <Button
                    onClick={() => window.open(config.AMBIENT_WEATHER_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.AMBIENT_WEATHER_IMG_SRC}
                        alt={config.AMBIENT_WEATHER_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.NEXT_JS_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.NEXT_JS_IMG_SRC}
                        alt={config.NEXT_JS_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.BING_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.BING_IMG_SRC}
                        alt={config.BING_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.GOOGLE_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.GOOGLE_IMG_SRC}
                        alt={config.GOOGLE_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
            </div>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <Button
                    onClick={() => window.open(config.FIRST_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.FIRST_IMG_SRC}
                        alt={config.FIRST_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.MINECRAFT_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.MINECRAFT_IMG_SRC}
                        alt={config.MINECRAFT_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.MABINOGI_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.MABINOGI_IMG_SRC}
                        alt={config.MABINOGI_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => window.open(config.NATION_STATES_LINK, '_blank')}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.NATION_STATES_IMG_SRC}
                        alt={config.NATION_STATES_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
            </div>
        </div>
    );
}
