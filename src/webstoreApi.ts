import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Readable } from 'stream';
import * as consts from './consts';
import { ILicensesResponse, IPaymentsResponse, IUserLicensesResponse, IWebstoreResource } from './consts';
import { WebstoreResource } from './webstoreResource';

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
            data: readStream,
        });

        return new WebstoreResource(result.data);
    }

    // noinspection JSUnusedGlobalSymbols
    public async getUpload(appId: string): Promise<consts.IWebstoreResource> {
        const result = await this._client.get(consts.urls.uploadGet(appId), {
            headers: this.getHeaders(),
            responseType: 'json',
        });

        return new WebstoreResource(result.data);
    }

    // noinspection JSUnusedGlobalSymbols
    public async publish(
        appId: string,
        target: consts.PublishTarget | string = consts.PublishTarget.DEFAULT,
    ): Promise<consts.IPublishResponse> {
        const result = await this._client.post(consts.urls.publishPost(appId, target), undefined, {
            responseType: 'json',
            headers: this.getHeaders(),
        });

        return result.data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Gets the licenses for Chrome hosted apps.
     * @param appId Chrome Web Store app ID. Get the app ID from the Chrome Developer Dashboard after you upload your app for the first time.
     * @param userId OpenID URL for the user's Google Account.
     */
    public async getLicenses(appId: string, userId: string): Promise<ILicensesResponse> {
        const result = await this._client.get(consts.urls.licensesGet(appId, userId));
        return result.data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Gets the user licenses for Chrome Apps and Chrome Extensions.
     * @param appId Chrome Web Store app ID. Get the app ID from the Chrome Developer Dashboard after you upload your app for the first time.
     */
    public async getUserLicenses(appId: string): Promise<IUserLicensesResponse> {
        const result = await this._client.get(consts.urls.userLicensesGet(appId));
        return result.data;
    }

    /**
     * Lists the in-app products that the user has purchased.
     * @param itemId Chrome Web Store app ID. Get the app ID from the Chrome Developer Dashboard after you upload your app for the first time.
     */
    public async getPayments(itemId: string): Promise<IPaymentsResponse> {
        const result = await this._client.get(consts.urls.paymentsGet(itemId));
        return result.data;
    }

    protected getHeaders(): { [k: string]: string } {
        return {
            Authorization: `Bearer ${this._token}`,
            'x-goog-api-version': '2',
        };
    }
}
