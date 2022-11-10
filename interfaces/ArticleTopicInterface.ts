import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface ArticleTopicInterface extends CreateArticleTopicInterface, Omit<ApiPlatformItemResponse,"@context">{
  
}

export interface CreateArticleTopicInterface {
  "@context": "/article_topics";
  name: string;
  whitelist: string[];
  blacklist: string[];
}

export interface UpdateArticleTopicInterface extends ApiPlatformItemResponse{
  name?: string;
  whitelist?: string[];
  blacklist?: string[];
}