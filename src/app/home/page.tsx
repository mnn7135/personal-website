'use client';

import { PaddingBar } from '@/components/personal-website/padding-bar';
import { Button } from '@/components/ui/button';
import { IAppConfig, loadAppConfig } from '@/services/configs/app-config.service';
import Image from 'next/image';
import { redirect } from 'next/navigation';
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
    }, []);

    return (
        <div>
            <div className="p-2 text-3xl font-bold">{config.QUCIK_LINKS_SECTION}</div>
            <PaddingBar></PaddingBar>
            <br></br>
            <div className="flex flex-row flex-wrap place-content-around">
                <Button
                    onClick={() => redirect(config.STACK_OVERFLOW_LINK)}
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
                    onClick={() => redirect(config.GIT_LINK)}
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
                    onClick={() => redirect(config.TRELLO_LINK)}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.TRELLO_IMG_SRC}
                        alt={config.TRELLO_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => redirect(config.GOOGLE_LINK)}
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
                    onClick={() => redirect(config.RIT_LINK)}
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
                    onClick={() => redirect(config.GTRI_LINK)}
                    className={`h-${BUTTON_SCALE} w-${BUTTON_SCALE}`}
                    variant={'outline'}
                >
                    {' '}
                    <Image
                        src={config.GTRI_IMAGE_SRC}
                        alt={config.GTRI_ALT}
                        width={imageSize}
                        height={imageSize}
                    ></Image>
                </Button>
                <Button
                    onClick={() => redirect(config.LINKEDIN_LINK)}
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
                <Button
                    onClick={() => redirect(config.GOOGLE_LINK)}
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
                    onClick={() => redirect(config.FIRST_LINK)}
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
                    onClick={() => redirect(config.BING_LINK)}
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
                    onClick={() => redirect(config.GOOGLE_LINK)}
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
                <Button
                    onClick={() => redirect(config.GOOGLE_LINK)}
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
        </div>
    );
}
