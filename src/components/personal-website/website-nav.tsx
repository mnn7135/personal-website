'use client';

import * as React from 'react';
import Link from 'next/link';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import {
    CloudFogIcon,
    CloudLightning,
    CloudRainIcon,
    CloudSnowIcon,
    CloudyIcon,
    DogIcon,
    LoaderIcon,
    MenuIcon,
    MoonStarIcon,
    SunIcon,
    WindIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { useWeatherContext } from '../providers/weatherDataProvider';
import { loadWeatherConfig } from '@/services/configs/weather-config.service';

export function WebsiteNavagationMenu() {
    const { liveWeatherData, analysisService } = useWeatherContext();
    const todayWeatherData = liveWeatherData ? liveWeatherData[0] : null;
    const config = loadWeatherConfig();

    const WEATHER_ICON_SIZE = 192;

    // A helper function to get the correct icon for the weather condition.
    function getWeatherIcon(weatherCondition: string) {
        switch (weatherCondition) {
            case config.WEATHER_SUNNY:
                return <SunIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_CLOUDS:
                return <CloudyIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_PARTLY_CLOUDS:
                return <CloudyIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_STORM:
                return <CloudLightning size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_RAIN:
                return <CloudRainIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_SNOW:
                return <CloudSnowIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_CLEAR:
                return <MoonStarIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_WIND:
                return <WindIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_FOG:
                return <CloudFogIcon size={WEATHER_ICON_SIZE} />;
            case config.WEATHER_BREEZE:
                return <WindIcon size={WEATHER_ICON_SIZE} />;
            case 'LOADING':
                return <LoaderIcon size={WEATHER_ICON_SIZE}></LoaderIcon>;
        }
    }

    return (
        <div className="flex flex-row flex-wrap justify-between bg-gray-300 pt-2">
            <NavigationMenu viewport={false}>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>
                            <MenuIcon></MenuIcon>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="absolute w-55">
                            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <a
                                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                            href="/weather"
                                        >
                                            <div className="">
                                                {getWeatherIcon(
                                                    analysisService?.getCurrentWeatherCondition() ??
                                                        ''
                                                )}
                                            </div>
                                            <div className="mt-4 mb-2 text-lg font-medium">
                                                Current Conditions
                                            </div>
                                            <p className="text-muted-foreground text-sm leading-tight">
                                                {`${todayWeatherData?.tempf ? Math.round(todayWeatherData?.tempf) : '-'} °F `}
                                                {analysisService?.getCurrentWeatherCondition() ??
                                                    'Loading...'}
                                            </p>
                                        </a>
                                    </NavigationMenuLink>
                                </li>
                                <ListItem href="/home" title="Home">
                                    The WeatherWolf homepage.
                                </ListItem>
                                <ListItem href="/weather/graphs" title="Data Graphs">
                                    Live and Historical data from our region.
                                </ListItem>
                                <ListItem href="/about" title="About">
                                    About the WeatherWolf team and our mission.
                                </ListItem>
                                <ListItem href="/weather/radar" title="Live Radar">
                                    Live radar for the Finger Lakes Region.
                                </ListItem>
                                <ListItem href="/contact" title="Contact">
                                    How you can reach or us, or join the WeatherWolf network!
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div className="flex flex-row">
                <div>
                    <DogIcon size={'40'} />
                </div>
                <div className="text-4xl font-bold">WeatherWolf</div>
            </div>
            <div className="flex flex-col pr-2">
                <div>
                    {`${todayWeatherData?.tempf ? Math.round(todayWeatherData?.tempf) : '-'} °F `}
                    {analysisService?.getCurrentWeatherCondition() ?? 'Loading...'}
                </div>
                <div>
                    <Button size={'sm'} variant={'outline'}>
                        Victor, NY
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <div className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
