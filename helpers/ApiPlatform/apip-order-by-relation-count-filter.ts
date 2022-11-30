import { ApipFilter, ApipFilterOptions } from './apip-filter';

export enum ApipOrder {
    ASC = 'asc',
    DESC = 'desc',
}

export interface ApipOrderByRelationCountFilterOptions extends ApipFilterOptions {
    order: ApipOrder;
    properties: string[];
}

export class ApipOrderByRelationCountFilter extends ApipFilter {

    constructor(options: ApipOrderByRelationCountFilterOptions) {
        super(options);

        this.key = options.key;
        this.order = options.order;
        this.properties = options.properties;
    }

    static ASC = 'asc';
    static DESC = 'desc';
    order: ApipOrder;
    properties: string[];

    urlEncode(): string {
        return `order_by_relation_count[${this.key}]=${this.order}${this.properties.map(property=> {return(`&properties[]=${property}`)}).join('')}`;
    }
}
