'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from '@/components/ui/chart';

interface ChartLineDefaultProps {
    chartTitle?: string;
    chartData: any[];
    xAxisKey: string;
    yAxisKey: string;
    displayYAxis?: boolean;
    footerNotes?: string;
    chartConfig: ChartConfig;
    xAxisLabelMapper: (value: any) => string;
    xAxisReversed?: boolean;
}

export function ChartLineDefault(props: ChartLineDefaultProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{props.chartTitle ?? ''}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={props.chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={props.chartData}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={props.xAxisKey}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            reversed={props.xAxisReversed}
                            tickFormatter={(value) => {
                                return props.xAxisLabelMapper(value);
                            }}
                        />
                        {props.displayYAxis ? (
                            <YAxis
                                dataKey={props.yAxisKey}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value}
                            />
                        ) : (
                            ''
                        )}
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line
                            dataKey={props.yAxisKey}
                            type="natural"
                            stroke={`var(--color-${props.yAxisKey}`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">{props.footerNotes ?? ''}</div>
            </CardFooter>
        </Card>
    );
}
