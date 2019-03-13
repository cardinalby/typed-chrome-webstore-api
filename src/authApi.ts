import axios from 'axios';
import * as consts from './consts';

export async function fetchToken(clientId: string, clientSecret: string, refreshToken: string) {
    const result = await axios.post(
        consts.urls.refreshTokenPost(),
        {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        },
        {
            responseType: 'json',
        }
    );

    return result.data.access_token;
}
