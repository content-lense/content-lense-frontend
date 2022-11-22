import { QueryKey } from "@tanstack/react-query";
import { filter } from "d3-array";
import moment from "moment";
import { Range } from "react-date-range";
import { ApiFetch } from "../helpers/ApiFetch";
import { ApipFilterEncoder } from "../helpers/ApiPlatform/apip-filter-encoder";
import { ApiPlatformItemResponse, ApiPlatformResponse } from "../interfaces/ApiPlatformResponseInterface";
import { ArticleInterface } from "../interfaces/ArticleInterface";

export const DefaultQueryFn = async (a: unknown, queryKey: QueryKey) => {
  const data = await ApiFetch(`${queryKey[0]}`);
  return data.json();
};


export interface ApiPlatformQueryParams {
  page?: number;
  itemsPerPage?: number;
}

export interface GenericGetItemsOptions extends ApiPlatformQueryParams {
  queryString?: string;
}


export const GenericGetItemsAsHydra = async <T extends unknown>(
  entity: string,
  filterEncoder?: ApipFilterEncoder
) => {
  const req = await ApiFetch(
    entity + (filterEncoder ? "?" + filterEncoder.encode() : "")
  );
  let payload = (await req.json()) as ApiPlatformResponse<T>;
  payload["hydra:member"] = parseDateObjects(payload["hydra:member"]);
  return payload;
}

export const GenericGetItems = async <T extends unknown>(
  entity: string,
  filterEncoder?: ApipFilterEncoder,
) => {
  console.log("Encoder", filterEncoder);
  const req = await ApiFetch(
    entity + (filterEncoder ? "?" + filterEncoder.encode() : "")
  );
  const payload = (await req.json()) as ApiPlatformResponse<T>;
  let elements = payload["hydra:member"];
  elements = parseDateObjects(elements);
  return elements;
};

const parseDateObjects = (elements: any) => {
  return elements.map((e: any) => {
    if (e.createdAt) e.createdAt = new Date(e.createdAt);
    if (e.updatedAt) e.updatedAt = new Date(e.updatedAt);
    if (e.publishedAt) e.publishedAt = new Date(e.publishedAt);
    return e;
  });
}
export const GenericGetItem = async <T extends unknown>(iri: string) => {
  const req = await ApiFetch(iri);
  const e = (await req.json()) as T;
  // @ts-ignore
  if (e.createdAt) e.createdAt = new Date(e.createdAt);
  // @ts-ignore
  if (e.updatedAt) e.updatedAt = new Date(e.updatedAt);
  // @ts-ignore
  if (e.publishedAt) e.publishedAt = new Date(e.publishedAt);
  return e;
};

interface ApiPlatformContext {
  "@context"?: string;
}
export const GenericPostItem = async <T extends ApiPlatformContext, U extends unknown>(
  payload: T
): Promise<U> => {
  let url = payload["@context"];
  delete payload["@context"];
  const req = await ApiFetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!req.ok) {
    const result = (await req.json());
    throw new Error(result["hydra:description"] ?? "Unknown error");
  }
  const result = (await req.json()) as U;
  return result;
};

export const GenericPutItem = async <T extends ApiPlatformItemResponse, U extends unknown>(
  payload: T,
): Promise<U> => {
  const req = await ApiFetch(payload["@id"], {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!req.ok) {
    const result = (await req.json());
    throw new Error(result["hydra:description"] ?? "Unknown error");
  }
  const result = (await req.json()) as U;
  return result;
};



export const CreateDateRangeQueryKeyObj = (dateRange?: Range | null) => {
  if (typeof dateRange == "undefined" || dateRange === null) {
    return { start: null, end: null };
  }
  return {
    start: dateRange.startDate ? moment(dateRange.startDate).format("YYYY-MM-DD") : null,
    end: dateRange.endDate ? moment(dateRange.endDate).format("YYYY-MM-DD") : null,
  };
};

export const deleteObjectByIri = async (iri: string): Promise<string> => {
  const req = await ApiFetch(iri, { method: "DELETE" });
  if (req.ok) {
    return iri;
  }
  return "";
};
