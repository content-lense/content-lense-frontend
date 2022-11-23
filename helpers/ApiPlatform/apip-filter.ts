export interface ApipFilterOptions {
    key: string;
}

export abstract class ApipFilter {
    key: string;

    abstract urlEncode(): string | undefined;

    constructor(options: ApipFilterOptions) {
        this.key = options.key;
    }
}
