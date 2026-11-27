'use client';

import IWeatherAnalysisService from '@/services/weather/weather-analysis.service';
import {
    getWeatherData,
    hasSubmittedWeatherToday,
    postTodayWeatherData,
    getWeatherHistory,
    getSunData
} from '@/services/weather/weather-data.service';
import IWeatherPredictionService from '@/services/weather/weather-prediction.service';
import { ISunDataResult } from '@/types/weather/sun-data.domain';
import { IWeatherData, IWeatherForecast } from '@/types/weather/weather-data.domain';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WeatherContextType {
    historicalWeatherData: IWeatherData[] | null;
    liveWeatherData: IWeatherData[] | null;
    sunData: ISunDataResult | null;
    analysisService: IWeatherAnalysisService | null;
    predictionService: IWeatherPredictionService | null;
    submittedToday: boolean;
    loading: boolean;
}

const WeatherContext = createContext<WeatherContextType>({
    historicalWeatherData: [],
    liveWeatherData: [],
    sunData: null,
    analysisService: null,
    predictionService: null,
    submittedToday: true,
    loading: true
});

/**
 * Simple hook to access weather data.
 */
export function useWeatherContext() {
    return useContext(WeatherContext);
}

/**
 * A global context to supply every page with the relevant weather data.
 *
 * @param children - The React child components that will have access to the context values.
 */
export default function WeatherContextProvider({ children }: { children: ReactNode }) {
    // Fetches and sets the current day, today's weather data, and the current weather right now.
    const [weatherData, setWeatherData] = useState<IWeatherData[]>();

    const [loading, setLoading] = useState<boolean>(true);

    const fetchWeatherData = async () => {
        const fetchedData = await getWeatherData();
        setWeatherData(fetchedData);
    };

    useEffect(() => {
        if (!weatherData) {
            fetchWeatherData();
        }
    });

    // Fetches and sets if the database has received data for today.
    const [hasSubmittedData, setHasSubmittedData] = useState<boolean>();

    const fetchHasTodayData = async () => {
        const isDataSubmitted = await hasSubmittedWeatherToday();
        setHasSubmittedData(isDataSubmitted);
    };

    useEffect(() => {
        if (!hasSubmittedData) {
            fetchHasTodayData();
        }
    });

    // Fetches weather history data stored in the database.
    const [weatherHistoryData, setWeatherHistoryData] = useState<IWeatherData[]>();

    const fetchWeatherHistory = async () => {
        const historicalData: IWeatherData[] = await getWeatherHistory();

        if (historicalData) {
            setWeatherHistoryData(historicalData);
        }
    };

    useEffect(() => {
        if (!weatherHistoryData) {
            fetchWeatherHistory();
        }
    }, [hasSubmittedData]);

    // Fetches and sets the sun data for today.
    const [sunData, setSunData] = useState<ISunDataResult>();

    const fetchSunData = async () => {
        const fetchedData = await getSunData();
        setSunData(fetchedData.results);
    };

    useEffect(() => {
        if (!sunData) {
            fetchSunData();
        }
    });

    // Set up the Analysis Service
    const [analysisService, setAnalysisService] = useState<IWeatherAnalysisService>();

    useEffect(() => {
        if (weatherData && sunData) {
            setAnalysisService(new IWeatherAnalysisService(weatherData, sunData));
        }
    }, [weatherData, sunData]);

    // Set up the Prediction Service
    const [weatherPredictionService, setWeatherPredictionService] =
        useState<IWeatherPredictionService>();

    useEffect(() => {
        if (weatherData && weatherHistoryData && sunData) {
            setWeatherPredictionService(
                new IWeatherPredictionService(weatherData, weatherHistoryData, sunData)
            );
        }
        setLoading(false);
    }, [weatherData, weatherHistoryData, sunData]);

    return (
        <WeatherContext.Provider
            value={{
                historicalWeatherData: weatherHistoryData ?? [],
                liveWeatherData: weatherData ?? [],
                sunData: sunData ?? null,
                predictionService: weatherPredictionService ?? null,
                analysisService: analysisService ?? null,
                submittedToday: hasSubmittedData ?? true,
                loading: loading
            }}
        >
            {children}
        </WeatherContext.Provider>
    );
}
