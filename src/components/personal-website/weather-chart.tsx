import { IWeatherData } from '@/types/weather/weather-data.domain';
import { ChartConfig } from '../ui/chart';
import { ChartLineDefault } from '../ui/chart-line-default';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '../ui/select';
import { useState } from 'react';
import IWeatherHelperService from '@/services/weather/weather-helper.service';
import { ThinPaddingBar } from './padding-bar';

interface WeatherChartProps {
    chartData?: IWeatherData[];
}

const chartConfig = {
    tempf: {
        label: 'Temperature (°F)',
        color: 'var(--chart-1)'
    },
    feelsLike: {
        label: 'Temperature (°F)',
        color: 'var(--chart-2)'
    },
    dewPoint: {
        label: 'Dew Point (°F)',
        color: 'var(--chart-3)'
    },
    humidity: {
        label: 'Humidity (%)',
        color: 'var(--chart-4)'
    },
    hourlyrainin: {
        label: 'Hourly Rainfall (in.)',
        color: 'var(--chart-5)'
    },
    baromabsin: {
        label: 'Pressure (mbar)',
        color: 'var(--chart-1)'
    },
    windspdmph_avg10m: {
        label: 'Wind Speed (mph)',
        color: 'var(--chart-2)'
    },
    windgustmph: {
        label: 'Wind Gust (mph)',
        color: 'var(--chart-3)'
    },
    uv: {
        label: 'UV Index',
        color: 'var(--chart-4)'
    },
    solarradiation: {
        label: 'Solar Radiation (W/m^2)',
        color: 'var(--chart-5)'
    }
} satisfies ChartConfig;

const axisMapper = (value: any) => {
    const strValue: string = value as string;

    const time = new Date(strValue).toLocaleTimeString();

    return time;
};

export function WeatherChart(props: WeatherChartProps) {
    const [selectedGraph, setSelectedGraph] = useState<string>('tempf');
    const helperService = new IWeatherHelperService();
    const shortenedData = [];
    let count = 0;

    if (props.chartData) {
        for (const row of props.chartData) {
            if (count % 15 == 0) {
                shortenedData.push({
                    ...row,
                    baromabsin: helperService.getPressureInMbar(row.baromabsin)
                });
            }
            count++;
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center">
                <Select
                    onValueChange={(value) => {
                        setSelectedGraph(value);
                    }}
                    defaultValue="tempf"
                >
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a data element to view." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Conditions</SelectLabel>
                            <SelectItem value="tempf">Outdoor Temperature</SelectItem>
                            <SelectItem value="feelsLike">Feels Like Temperature</SelectItem>
                            <SelectItem value="dewPoint">Dew Point</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                            <SelectItem value="hourlyrainin">Hourly Rainfall</SelectItem>
                            <SelectItem value="baromabsin">Pressure</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Wind</SelectLabel>
                            <SelectItem value="windspdmph_avg10m">
                                {'Wind Speed (Average)'}
                            </SelectItem>
                            <SelectItem value="windgustmph">{'Maximum Wind Gusts'}</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Solar</SelectLabel>
                            <SelectItem value="uv">UV Index</SelectItem>
                            <SelectItem value="solarradiation">Solar Radiation</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <br></br>
            </div>
            <ThinPaddingBar></ThinPaddingBar>
            <br></br>
            <ChartLineDefault
                chartData={shortenedData as any[]}
                xAxisKey={'date'}
                xAxisLabelMapper={axisMapper}
                yAxisKey={selectedGraph}
                chartConfig={chartConfig}
                displayYAxis={true}
                xAxisReversed={true}
            ></ChartLineDefault>
        </div>
    );
}
