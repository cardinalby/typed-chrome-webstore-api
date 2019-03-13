import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Readable } from 'stream';
import * as consts from './consts';

// noinspection JSUnusedGlobalSymbols
export class WebstoreApi {
    protected _token: string;
    protected readonly _client: AxiosInstance;

    constructor(token: string, axiosConfig?: AxiosRequestConfig) {
        this._token = token;
        this._client = axios.create(axiosConfig);
    }

    // noinspection JSUnusedGlobalSymbols
    public setToken(token: string) {
        this._token = token;
    }

    // noinspection JSUnusedGlobalSymbols
    public async upload(readStream: Buffer | Readable, appId?: string): Promise<consts.IWebstoreResource> {
        const url = appId ? consts.urls.uploadPut(appId) : consts.urls.uploadPost();

        const result = await this._client.request({
            url,
            method: appId ? 'PUT' : 'POST',
            headers: this.getHeaders(),
            responseType: 'json',
            data: readStream
        });

        return result.data;
    }

    // noinspection JSUnusedGlobalSymbols
    public async getUpload(appId: string): Promise<consts.IWebstoreResource> {
        const result = await this._client.get(
            consts.urls.uploadGet(appId),
            {
                headers: this.getHeaders(),
                responseType: 'json',
            });

        return result.data;
    }

    // noinspection JSUnusedGlobalSymbols
    public async publish(
        appId: string,
        target: consts.PublishTarget | string = consts.PublishTarget.DEFAULT
    ): Promise<consts.IPublishResponse> {
        const result = await this._client.post(
            consts.urls.publishPost(appId, target), undefined,
            {
                responseType: 'json',
                headers: this.getHeaders()
            });

        return result.data;
    }

    protected getHeaders(): { [k: string]: string } {
        return {
            'Authorization': `Bearer ${this._token}`,
            'x-goog-api-version': '2',
        };
    }
}
