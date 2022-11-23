import { ApipRangeFilter } from './apip-range-filter';
import { ApipArrayValueFilter } from './apip-array-value-filter';
import { ApipFilter } from './apip-filter';
import { ApipSingleValueFilter } from './apip-single-value-filter';
import { ApipOrder, ApipOrderFilter } from './apip-order-filter';
import { ApipDateFilter } from './apip-date-filter';
import { ApipPageFilter } from './apip-page-filter';

const filterClasses = {
    [typeof ApipArrayValueFilter]: ApipArrayValueFilter,
    [typeof ApipRangeFilter]: ApipRangeFilter,
    [typeof ApipSingleValueFilter]: ApipSingleValueFilter,
};

export class ApipFilterEncoder {
    private filters: { [key: string]: ApipFilter } = {};

    private add(filter: ApipFilter) {
        this.filters[filter.key + '_' + filter.constructor.name] = filter;
    }

    clearFilters(){
        this.filters = {};
    }

    addRangeFilter(key: string, value?: { min: number; max: number }) {
        if (value && value.min !== undefined && value.max !== undefined) {
            this.add(
                new ApipRangeFilter({ key, min: value.min, max: value.max })
            );
        }
        return this;
    }

    addArrayFilter<T>(key: string, values?: T[]) {
        if (values && values.length > 0) {
            this.add(new ApipArrayValueFilter({ key, values }));
        }
        return this;
    }

    addOrderFilter<T>(key: string, order?: ApipOrder | null | undefined) {
        if (order) {
            this.add(new ApipOrderFilter({ key, order }));
        }
        return this;
    }

    addSingleValueFilter(key: string, value?: number | string | boolean) {
        if (value) {
            this.add(new ApipSingleValueFilter({ key, value }));
        }
        return this;
    }

    addDateFilter(key: string, dates: {before?: Date, after?: Date}){
        if(dates){
            this.add(new ApipDateFilter({key, ...dates}))
        }
        return this;
    }

    addPageFilter(pageOptions: {itemsPerPage?: number, page?: number}){
        if(pageOptions){
            this.add(new ApipPageFilter(pageOptions))
        }
        return this;
    }

    public encode() {
        const filters: ApipFilter[] = [];
        Object.keys(this.filters).forEach((key) => {
            filters.push(this.filters[key]);
        });

        /*  */

        return filters.reduce((acc, filter, index, array) => {
            const encodedFilter = filter.urlEncode();
            if (encodedFilter !== undefined) {
                return acc + (index !== 0 ? '&' : '') + encodedFilter;
            }
            return acc;
        }, '');
    }
}
