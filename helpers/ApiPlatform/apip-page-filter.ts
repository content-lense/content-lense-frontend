import { number } from 'yup';
import { ApipFilter, ApipFilterOptions } from './apip-filter';

export interface ApipPageFilterOptions extends Omit<ApipFilterOptions, 'key'> {
    itemsPerPage?: number;
    page?: number;
}

export class ApipPageFilter extends ApipFilter {
    itemsPerPage?: number;
    page?: number;

    constructor(options: ApipPageFilterOptions) {
        super({...options, key:""});

        this.itemsPerPage = options.itemsPerPage;
        this.page = options.page
    }

    urlEncode(): string {
        if(this.itemsPerPage && this.page) return`itemsPerPage=${this.itemsPerPage}&page=${this.page}`;
        else if(this.itemsPerPage) return `itemsPerPage=${this.itemsPerPage}`;
        else if(this.page) return `page=${this.page}`;
        else return "";
    }
}
