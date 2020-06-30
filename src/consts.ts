const GOOGLE_APIS_URL = 'https://www.googleapis.com';
const ITEMS_API = `chromewebstore/v1.1/items`;

export enum PublishTarget {
    DEFAULT = 'default',
    TRUSTED_TESTERS = 'trustedTesters',
}

export const urls = {
    refreshTokenPost: (): string => {
        return `${GOOGLE_APIS_URL}/oauth2/v4/token`;
    },

    uploadPost: (): string => {
        return `${GOOGLE_APIS_URL}/upload/${ITEMS_API}`;
    },

    uploadPut: (id: string): string => {
        return `${GOOGLE_APIS_URL}/upload/${ITEMS_API}/${encodeURIComponent(id)}`;
    },

    uploadGet: (id: string): string => {
        return `${GOOGLE_APIS_URL}/${ITEMS_API}/${encodeURIComponent(id)}?projection=draft`;
    },

    publishPost: (id: string, target: string): string => {
        return (
            `${GOOGLE_APIS_URL}/${ITEMS_API}/` +
            `${encodeURIComponent(id)}/publish?publishTarget=${encodeURIComponent(target)}`
        );
    },

    licensesGet: (appId: string, userId: string): string => {
        return `${GOOGLE_APIS_URL}/licenses/${encodeURIComponent(appId)}/${encodeURIComponent(userId)}`;
    },

    userLicensesGet: (appId: string): string => {
        return `${GOOGLE_APIS_URL}/${ITEMS_API}/userlicenses/${encodeURIComponent(appId)}`;
    },

    paymentsGet: (id: string): string => {
        return `${GOOGLE_APIS_URL}/${ITEMS_API}/items/${encodeURIComponent(id)}/payments`;
    },
};

export enum UploadState {
    // noinspection JSUnusedGlobalSymbols
    FAILURE = 'FAILURE',
    IN_PROGRESS = 'IN_PROGRESS',
    NOT_FOUND = 'NOT_FOUND',
    SUCCESS = 'SUCCESS',
}

export interface IItemErrorEntry {
    error_code: string;
    error_detail: string;
}

/**
 * @see https://developer.chrome.com/webstore/webstore_api/items#resource
 */
export interface IWebstoreResource {
    /**
     * Identifies this resource as an Item.
     * Value: the fixed string "chromewebstore#item".
     */
    kind: string;

    /** Unique ID of the item. */
    id: string;

    /** Public key of this item. */
    publicKey: string;

    /** Status of the operation. */
    uploadState: UploadState;

    /**
     * Not documented, exists in 'get' response. Semver version
     */
    crxVersion?: string;

    /**
     * Detail human-readable status of the operation, in English only.
     * Same error messages are displayed when you upload your app
     * to the Chrome Web Store.
     */
    itemError: IItemErrorEntry[];
}

export enum PublishStatus {
    // noinspection JSUnusedGlobalSymbols
    OK = 'OK',
    NOT_AUTHORIZED = 'NOT_AUTHORIZED',
    INVALID_DEVELOPER = 'INVALID_DEVELOPER',
    DEVELOPER_NO_OWNERSHIP = 'DEVELOPER_NO_OWNERSHIP',
    DEVELOPER_SUSPENDED = 'DEVELOPER_SUSPENDED',
    ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
    ITEM_PENDING_REVIEW = 'ITEM_PENDING_REVIEW',
    ITEM_TAKEN_DOWN = 'ITEM_TAKEN_DOWN',
    PUBLISHER_SUSPENDED = 'PUBLISHER_SUSPENDED',
}

/**
 * @see https://developer.chrome.com/webstore/webstore_api/items/publish
 */
export interface IPublishResponse {
    /** Static string value is always "chromewebstore#item". */
    kind: string;

    /** The ID of this item. */
    item_id: string;

    /** The status code of this publish operation. It may contain multiple elements */
    status: PublishStatus[];

    /** Detailed human-comprehensible explanation of the status code above */
    statusDetail: string[];
}

export const enum LicenseAccessLevelEnum {
    FREE_TRIAL = 'FREE_TRIAL',
    FULL = 'FULL',
}

/**
 * @see https://developer.chrome.com/webstore/webstore_api/licenses#resource
 */
export interface ILicensesResponse {
    /**
     * Identifies this resource as a license. Value: the fixed string
     */
    kind: 'chromewebstore#license';

    /**
     * This value is a concatenation of the appId and userId seperated by a forward slash, for example: ekjjfhlnedeokeakcddlnockkdiacakf/8098347.
     */
    id: string;

    /**
     * Chrome Web Store app ID. Get the app ID from the Chrome Developer Dashboard after you upload your app for the first time.
     */
    appId: string;

    /**
     * OpenID URL for the user's Google Account.
     */
    userId: string;

    result: 'YES' | 'NO';

    accessLevel: LicenseAccessLevelEnum;

    /**
     * Once you've got the response, cache is only valid for the max number of seconds.
     */
    maxAgeSecs: number;
}

/**
 * @see https://developer.chrome.com/webstore/webstore_api/userLicenses#resource
 */
export interface IUserLicensesResponse {
    /**
     * Identifies this resource as a license. Value: the fixed string
     */
    kind: 'chromewebstore#userLicense.';

    /**
     * The ID of the item to query for in-app products.
     */
    itemId: string;

    /**
     * Creation time of license. Number of milliseconds.
     */
    createdTime: number;

    /**
     * TRUE = User has license. FALSE = User does not have license.
     */
    result: boolean;

    accessLevel: LicenseAccessLevelEnum;

    /**
     * Time that results can be cached.
     */
    maxAgeSecs: number;
}

export const enum PaymentStateEnum {
    ACTIVE = 'ACTIVE',
    PAYMENT_DECLINED = 'PAYMENT_DECLINED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    REJECTED = 'REJECTED',
    PENDING = 'PENDING',
    CANCELLED_BY_DEVELOPER = 'CANCELLED_BY_DEVELOPER',
    DISABLED = 'DISABLED',
}

/**
 * @see https://developer.chrome.com/webstore/webstore_api/payments#resource
 */
export interface IPaymentsResponse {
    /**
     * Static string value is always "chromewebstore#payment".
     */
    kind: 'chromewebstore#payment';

    /**
     * 	The ID of the item to query for in-app products.
     */
    itemId: string;

    /**
     * The in-app product ID.
     */
    sku: string;

    /**
     * Time of the creation of the payment.
     */
    createdTime: number;

    state: PaymentStateEnum;
}
