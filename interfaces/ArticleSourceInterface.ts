import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface ArticleSourceFieldMappingInterface {
    databaseField: string;
    path: string[]
}

export interface ArticleSourceMappingInterface {
    contentRoot: "string";
    fieldMappings: ArticleSourceFieldMappingInterface[]
}

export interface ArticleSourceInterface extends ApiPlatformItemResponse {
    url: string;
    type: "RSS"; // TODO: add more later
    importIntervalInMinutes: number;
    lastUpdatedAt: Date;
    organisation: string;
    mappingConfig: ArticleSourceMappingInterface;
}