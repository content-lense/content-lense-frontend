import { ApipFilter, ApipFilterOptions } from './apip-filter';

export interface ApipDateFilterOptions extends ApipFilterOptions {
    before?: Date;
    after?: Date;
}

export class ApipDateFilter extends ApipFilter {
    before?: string;
    after?: string;

    constructor(options: ApipDateFilterOptions) {
        super(options);

        this.before = options.before?.toISOString().split('T')[0];
        this.after = options.after?.toISOString().split('T')[0];
    }

    urlEncode(): string {
        if(this.before && this.after) return`${this.key}[before]=${this.before}&${this.key}[after]=${this.after}`;
        else if(this.before) return `${this.key}[before]=${this.before}`;
        else if(this.after) return `${this.key}[after]=${this.after}`;
        else return "";
    }
}
