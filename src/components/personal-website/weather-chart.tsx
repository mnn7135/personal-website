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
import { useEffect, useState } from 'react';
import IWeatherHelperService from '@/services/weather/weather-helper.service';
import { ThinPaddingBar } from './padding-bar';

interface WeatherChartProps {
    liveData?: IWeatherData[];
    historicalData?: IWeatherData[];
}

const LIVE_DATA = 'live';
const HISTORICAL_DATA = 'historical';
const TEMP_F = 'tempf';

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
    dailyrainin: {
        label: 'Daily Rainfall (in.)',
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
    winddir_avg10m: {
        label: 'Wind Direction (\u00B0 from N)',
        color: 'var(--chart-3)'
    },
    windgustmph: {
        label: 'Wind Gust (mph)',
        color: 'var(--chart-4)'
    },
    uv: {
        label: 'UV Index',
        color: 'var(--chart-5)'
    },
    solarradiation: {
        label: 'Solar Radiation (W/m^2)',
        color: 'var(--chart-1)'
    }
} satisfies ChartConfig;

const axisMapper = (value: any) => {
    const strValue: string = value as string;

    const localeTime = new Date(strValue).toLocaleString('en-US', { timeZone: 'America/New_York' });

    return `${localeTime}`;
};

export function WeatherChart(props: WeatherChartProps) {
    const [selectedGraph, setSelectedGraph] = useState<string>(TEMP_F);
    const [selectedDataSet, setSelectedDataSet] = useState<string>(LIVE_DATA);
    const [graphData, setGraphData] = useState<IWeatherData[]>();
    const helperService = new IWeatherHelperService();
    const liveData: IWeatherData[] = [];
    const historicalData: IWeatherData[] = [];
    let count = 0;

    if (props.liveData) {
        for (const row of props.liveData) {
            if (count % 12 == 0) {
                liveData.push({
                    ...row,
                    baromabsin: helperService.getPressureInMbar(row.baromabsin)
                });
            }
            count++;
        }
    }

    count = 0;

    if (props.historicalData) {
        for (const row of props.historicalData) {
            if (count % 2 == 0) {
                historicalData.push({
                    ...row,
                    baromabsin: helperService.getPressureInMbar(row.baromabsin)
                });
            }
            count++;
        }
    }

    liveData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        }
        return -1;
    });

    historicalData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        }
        return -1;
    });

    const handleWeatherData = async () => {
        if (selectedDataSet == LIVE_DATA) {
            setGraphData(liveData);
        } else if (selectedDataSet == HISTORICAL_DATA) {
            setGraphData(historicalData);
        }
    };

    useEffect(() => {
        handleWeatherData();
    }, [selectedDataSet]);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center">
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
                            {selectedDataSet == LIVE_DATA ? (
                                <SelectItem value="feelsLike">Feels Like Temperature</SelectItem>
                            ) : (
                                <></>
                            )}
                            <SelectItem value="dewPoint">Dew Point</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                            {selectedDataSet == LIVE_DATA ? (
                                <SelectItem value="hourlyrainin">Hourly Rainfall</SelectItem>
                            ) : (
                                <></>
                            )}
                            {selectedDataSet == HISTORICAL_DATA ? (
                                <SelectItem value="dailyrainin">Daily Rainfall</SelectItem>
                            ) : (
                                <></>
                            )}
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
                            {selectedDataSet == LIVE_DATA ? (
                                <SelectItem value="windgustmph">{'Maximum Wind Gusts'}</SelectItem>
                            ) : (
                                <></>
                            )}
                        </SelectGroup>
                        <SelectGroup>
                            <SelectLabel>Solar</SelectLabel>
                            <SelectItem value="uv">UV Index</SelectItem>
                            <SelectItem value="solarradiation">Solar Radiation</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => {
                        setSelectedDataSet(value);
                    }}
                    defaultValue="live"
                >
                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Select a data element to view." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value={LIVE_DATA}>Live (Last 24 Hours)</SelectItem>
                            <SelectItem value={HISTORICAL_DATA}>Historical</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <br></br>
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
