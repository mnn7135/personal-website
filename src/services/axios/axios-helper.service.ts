import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class AxiosServiceHelper {
    private readonly axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create();
    }

    public async fetch<T>(
        config: AxiosRequestConfig
    ): Promise<T> {
        return this.axiosInstance
            .request(config)
            .then(response => response.data);
    }

    public async fetchList<T>(
        config: AxiosRequestConfig
    ): Promise<T[]> {
        return this.fetch<T[]>(config);
    }
}