import { ApipFilter, ApipFilterOptions } from './apip-filter';

export interface ApipArrayValueFilterOptions<T> extends ApipFilterOptions {
    values: T[];
}

export class ApipArrayValueFilter<T> extends ApipFilter {
    values: T[];

    urlEncode() {
        return this.values && this.values.length > 0
            ? this.values.reduce((acc, value, index, array) => {
                  return (
                      acc +
                      (`${this.key}[]=${value}` +
                          (index < array.length - 1 ? '&' : ''))
                  );
              }, '')
            : undefined;
    }

    constructor(options: ApipArrayValueFilterOptions<T>) {
        super(options);
        this.values = options.values;
    }
}
