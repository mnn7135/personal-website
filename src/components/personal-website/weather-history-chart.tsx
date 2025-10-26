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
import { ThinPaddingBar } from './padding-bar';

interface WeatherChartProps {
    historicalData?: IWeatherData[];
}

const chartConfig = {
    tempf: {
        label: 'Temperature (°F)',
        color: 'var(--chart-1)'
    },
    dewPoint: {
        label: 'Dew Point (°F)',
        color: 'var(--chart-2)'
    },
    humidity: {
        label: 'Humidity (%)',
        color: 'var(--chart-3)'
    },
    dailyrainin: {
        label: 'Hourly Rainfall (in.)',
        color: 'var(--chart-4)'
    },
    baromabsin: {
        label: 'Pressure (mbar)',
        color: 'var(--chart-5)'
    },
    windspdmph_avg10m: {
        label: 'Wind Speed (mph)',
        color: 'var(--chart-1)'
    },
    winddir_avg10m: {
        label: 'Wind Direction (\u00B0 from N)',
        color: 'var(--chart-2)'
    },
    uv: {
        label: 'UV Index',
        color: 'var(--chart-3)'
    },
    solarradiation: {
        label: 'Solar Radiation (W/m^2)',
        color: 'var(--chart-4)'
    }
} satisfies ChartConfig;

const axisMapper = (value: any) => {
    const strValue: string = value as string;

    const localeTime = new Date(strValue);

    return `${localeTime}`;
};

export function WeatherHistoryChart(props: WeatherChartProps) {
    const [selectedGraph, setSelectedGraph] = useState<string>('baromabsin');
    const graphData = [];

    if (props.historicalData) {
        for (const row of props.historicalData) {
            graphData.push({
                ...row,
                baromabsin: row.baromabsin
            });
        }
    }

    graphData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        }
        return -1;
    });

    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center">
                <Select
                    onValueChange={(value) => {
                        setSelectedGraph(value);
                    }}
                    defaultValue="baromabsin"
                >
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a data element to view." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Conditions</SelectLabel>
                            <SelectItem value="tempf">Outdoor Temperature</SelectItem>
                            <SelectItem value="dewPoint">Dew Point</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                            <SelectItem value="dailyrainin">Daily Rainfall</SelectItem>
                            <SelectItem value="baromabsin">Pressure</SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Wind</SelectLabel>
                            <SelectItem value="windspdmph_avg10m">
                                {'Wind Speed (Average)'}
                            </SelectItem>
                            <SelectItem value="winddir_avg10m">
                                {'Wind Direction (\u00B0 from N)'}
                            </SelectItem>
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
                chartData={graphData as any[]}
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
