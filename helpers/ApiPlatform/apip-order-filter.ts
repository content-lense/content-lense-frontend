import { ApipFilter, ApipFilterOptions } from './apip-filter';

export enum ApipOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ApipOrderFilterOptions extends ApipFilterOptions {
    order: ApipOrder;
}

export class ApipOrderFilter extends ApipFilter {

    constructor(options: ApipOrderFilterOptions) {
        super(options);

        this.key = options.key;
        this.order = options.order;
    }

    static ASC = 'asc';
    static DESC = 'desc';
    order: ApipOrder;

    urlEncode(): string {
        return `order[${this.key}]=${this.order}`;
    }
}
