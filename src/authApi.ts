import got = require('got');
import * as consts from './consts';

export async function fetchToken(clientId: string, clientSecret: string, refreshToken: string) {
    const result = await got.post(consts.urls.refreshTokenPost(), {
        body: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        },
        json: true,
    });

    return result.body.access_token;
}
