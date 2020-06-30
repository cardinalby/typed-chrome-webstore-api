import { IItemErrorEntry, IWebstoreResource, UploadState } from './consts';
import { ItemErrorEntry } from './itemErrorEntry';

export class WebstoreResource implements IWebstoreResource {
    crxVersion?: string;
    id: string;
    itemError: ItemErrorEntry[] = [];
    kind: string;
    publicKey: string;
    uploadState: UploadState;

    constructor(resource: IWebstoreResource) {
        this.crxVersion = resource.crxVersion;
        this.id = resource.id;
        this.kind = resource.kind;
        this.publicKey = resource.publicKey;
        this.uploadState = resource.uploadState;

        if (Array.isArray(resource.itemError)) {
            this.itemError = resource.itemError.map((entry: IItemErrorEntry) => new ItemErrorEntry(entry));
        }
    }

    isFailedBecauseOfPendingReview(): boolean {
        return (
            this.uploadState === UploadState.FAILURE &&
            this.itemError.length === 1 &&
            this.itemError[0].isPendingReview()
        );
    }
}
