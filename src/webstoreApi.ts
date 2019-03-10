import * as got from 'got';
import { Readable } from 'stream';
import * as consts from './consts';

// noinspection JSUnusedGlobalSymbols
export class WebstoreApi {
    protected _token: string;

    constructor(token: string) {
        this._token = token;
    }

    // noinspection JSUnusedGlobalSymbols
    public setToken(token: string) {
        this._token = token;
    }

    // noinspection JSUnusedGlobalSymbols
    public async upload(readStream: Buffer | Readable, appId?: string): Promise<consts.IWebstoreResource> {
        const url = appId ? consts.urls.uploadPut(appId) : consts.urls.uploadPost();

        const action: got.GotFn = appId ? got.put.bind(got) : got.post.bind(got);

        const result = await action(url, {
            headers: this.getHeaders(),
            body: readStream
        });

        return JSON.parse(result.body);
    }

    // noinspection JSUnusedGlobalSymbols
    public async getUpload(appId: string): Promise<consts.IWebstoreResource> {
        const result = await got.get(consts.urls.uploadGet(appId), {
            headers: this.getHeaders(),
            json: true,
        });

        return result.body;
    }

    // noinspection JSUnusedGlobalSymbols
    public async publish(
        appId: string,
        target: consts.PublishTarget | string = consts.PublishTarget.DEFAULT
    ): Promise<consts.IPublishResponse> {
        const result = await got.post(consts.urls.publishPost(appId, target), {
            headers: this.getHeaders(),
            json: true,
        });

        return result.body;
    }

    protected getHeaders(): { [k: string]: string } {
        return {
            Authorization: `Bearer ${this._token}`,
            'x-goog-api-version': '2',
        };
    }
}
