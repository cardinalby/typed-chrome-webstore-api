import { IItemErrorEntry } from './consts';

export class ItemErrorEntry implements IItemErrorEntry {
    /* tslint:disable: variable-name */
    error_code: string;
    /* tslint:disable: variable-name */
    error_detail: string;

    constructor(entry: IItemErrorEntry) {
        this.error_code = entry.error_code;
        this.error_detail = entry.error_detail;
    }

    isPendingReview(): boolean {
        return this.error_code === 'CLIENT_ERROR' && this.error_detail.toLowerCase().indexOf('pending review') !== -1;
    }
}
