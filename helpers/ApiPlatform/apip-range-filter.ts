import { ApipFilter, ApipFilterOptions } from './apip-filter';

export interface ApipRangeFilterOptions extends ApipFilterOptions {
    min: number;
    max: number;
}

export class ApipRangeFilter extends ApipFilter {
    min: number;
    max: number;

    constructor(options: ApipRangeFilterOptions) {
        super(options);

        this.max = options.max;
        this.min = options.min;
    }

    urlEncode(): string {
        return `${this.key}[between]=${this.min}..${this.max}`;
    }
}
