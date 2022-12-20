import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface WebhookInterface extends CreateWebhookInterface, ApiPlatformItemResponse {
  runOnNewArticle: boolean;
  runAfterAnalyses: string[];
  isActive: boolean;
  logs: string[];
}

export interface CreateWebhookInterface {
  "@context": string
  name: string;
  endpoint: string;
}
