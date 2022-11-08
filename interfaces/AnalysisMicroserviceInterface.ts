import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface AnalysisMicroserviceInterface extends CreateAnalysisMicroserviceInterface {
  method: string;
  isActive: boolean;
  autoRunForNewArticles: boolean;
}

export interface CreateAnalysisMicroserviceInterface extends ApiPlatformItemResponse {
  name: string;
  endpoint: string;
}
