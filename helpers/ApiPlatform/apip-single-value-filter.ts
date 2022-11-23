import { ApipFilter, ApipFilterOptions } from './apip-filter';

export interface ApipSingleValueFilterOptions<T> extends ApipFilterOptions {
    value: T;
}

export class ApipSingleValueFilter<T> extends ApipFilter {
    value?: T;

    urlEncode() {
        if (this.value !== undefined) { return `${this.key}=${this.value}`; }
        return undefined;
    }

    constructor(options: ApipSingleValueFilterOptions<T>) {
        super(options);
        this.value = options.value;
    }
}
