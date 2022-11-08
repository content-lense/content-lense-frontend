import { QueryKey } from "@tanstack/react-query";
import moment from "moment";
import { Range } from "react-date-range";
import { ApiFetch } from "../helpers/ApiFetch";
import { ApiPlatformResponse } from "../interfaces/ApiPlatformResponseInterface";
import { ArticleInterface } from "../interfaces/ArticleInterface";

export const DefaultQueryFn = async (a:unknown, queryKey: QueryKey) => {
    const data = await ApiFetch(`${queryKey[0]}`);
    return data.json();
};

export interface ApiPlatformQueryParams {
    page?: number;
    itemsPerPage?: number;
    rangeOperator?: "between";
    rangeLowerBoundary?: string;
    rangeUpperBoundary?: string;
}

export interface GenericGetItemsOptions extends ApiPlatformQueryParams {
    queryString?: string;
}

export const GenericGetItems = async <T extends unknown>(entity:string, options?: GenericGetItemsOptions) => {
    const req = await ApiFetch(entity + (!options || typeof options.queryString === "undefined" ? "" : 
    options.queryString + (options.rangeOperator ? `[${options.rangeOperator}]=${options.rangeLowerBoundary}..${options.rangeUpperBoundary}`:"")));
    const payload = await req.json() as ApiPlatformResponse<T>;
    let elements = payload["hydra:member"];
    elements = elements.map(e => {
        // @ts-ignore
        if(e.createdAt) e.createdAt = new Date(e.createdAt);
        // @ts-ignore
        if(e.updatedAt) e.updatedAt = new Date(e.updatedAt);
        // @ts-ignore
        if(e.publishedAt) e.publishedAt = new Date(e.publishedAt);
        return e;
    })
    return elements;
}

export const GenericGetItem = async <T extends unknown>(iri:string) => {
    const req = await ApiFetch(iri);
    const e = await req.json() as T;
    // @ts-ignore
    if(e.createdAt) e.createdAt = new Date(e.createdAt);
    // @ts-ignore
    if(e.updatedAt) e.updatedAt = new Date(e.updatedAt);
    // @ts-ignore
    if(e.publishedAt) e.publishedAt = new Date(e.publishedAt);
    return e;
}

interface ApiPlatformContext {
    "@context"?: string;
}
export const GenericPostItem = async <T extends ApiPlatformContext, U extends unknown>(payload:T): Promise<U> => {
    let url = payload["@context"];
    delete payload["@context"];
    const req = await ApiFetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const result = await req.json() as U;
    return result;
};

export const CreateDateRangeQueryKeyObj = (dateRange?:Range|null) => {
    if(typeof dateRange == "undefined" || dateRange === null){
        return {start: null, end: null};
    }
    return {start: dateRange.startDate ? moment(dateRange.startDate).format("YYYY-MM-DD") : null, end: dateRange.endDate ? moment(dateRange.endDate).format("YYYY-MM-DD") : null};

}


export const deleteObjectByIri = async (iri: string): Promise<string> => {
    const req = await ApiFetch(iri, {method: "DELETE"});
    if(req.ok){
        return iri;
    }
    return "";
};
