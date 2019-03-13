/**
 * Based on information from
 * https://stackoverflow.com/questions/7184793/how-to-download-a-crx-file-from-the-chrome-web-store-for-a-given-id
 */

import axios from 'axios';
import { Readable } from 'stream';

export namespace DownloadCrx {
    function getUrl(
        extensionId: string,
        prodVersion: string,
        acceptFormat: string[],
        platform?: IPlatformRequest
    ): string {
        let url = 'https://clients2.google.com/service/update2/crx?response=redirect';
        url += '&prodversion=' + encodeURIComponent(prodVersion);
        url += '&acceptformat=' + encodeURIComponent(acceptFormat.join(','));

        if (platform) {
            url += '&os=' + encodeURIComponent(platform.os);
            url += '&arch=' + encodeURIComponent(platform.arch);
            url += '&nacl_arch=' + encodeURIComponent(platform.naclArch);
        }

        url += '&x=id%3D' + encodeURIComponent(extensionId) + '%26uc';

        return url;
    }

    /**
     * acceptformat=crx2,crx3 instructs the server to also respond with extensions in the CRX3 format
     * (instead of 204 No Content when the extension is not available as CRX2).
     */
    export enum CrxAcceptFormat {
        CRX2 = 'crx2',
        CRX3 = 'crx3'
    }

    /**
     * Probably allowed os
     */
    export enum PlatformRequestOs {
        MAC = 'mac',
        WIN = 'win',
        ANDROID = 'android',
        CROS = 'cros',
        OPEN_BSD = 'openbsd',
        LINUX = 'Linux'
    }

    /**
     * Probably allowed architectures
     */
    export enum PlatformRequestArch {
        ARM = 'arm',
        X86_64 = 'x86-64',
        X86_32 = 'x86-32'
    }

    /**
     * Some extensions contain NaCl modules, that require additional query string parameters
     */
    export interface IPlatformRequest {
        os: PlatformRequestOs | string;
        arch: PlatformRequestArch | string;
        naclArch: PlatformRequestArch | string;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Download published extension from Chrome Webstore using undocumented url
     * @param {string} extensionId extension id (not a name) in Chrome Webstore
     * @param {string} prodVersion the version of Chrome, which must be 31.0.1609.0 at the very least
     * @param {string[]} acceptFormat ['crx2', crx3'] normally
     * @param {IPlatformRequest} platform Some extensions contain NaCl modules, that require additional query string parameters
     * @return Readable stream with crx data
     */
    export async function downloadCrx(
        extensionId: string,
        prodVersion: string = '72.0.3626.121',
        acceptFormat: Array<CrxAcceptFormat | string> = [CrxAcceptFormat.CRX2, CrxAcceptFormat.CRX3],
        platform?: IPlatformRequest
    ): Promise<Readable> {
        const response = await axios.get(
            getUrl(extensionId, prodVersion, acceptFormat, platform),
            {
                responseType: 'stream',
                validateStatus: status => status === 200
            }
        );
        return response.data as Readable;
    }
}