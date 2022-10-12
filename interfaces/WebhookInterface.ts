import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface WebhookInterface extends CreateWebhookInterface{
    runOnNewArticle: boolean;
    runAfterAnalyses: string[];
}

export interface CreateWebhookInterface extends ApiPlatformItemResponse{
    name: string;
    endpoint: string;
}
