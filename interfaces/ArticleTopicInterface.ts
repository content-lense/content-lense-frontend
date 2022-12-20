import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";
import { ArticleInterface } from "./ArticleInterface";

export interface ArticleTopicInterface extends CreateArticleTopicInterface, Omit<ApiPlatformItemResponse, "@context"> {
  articles: ArticleInterface[];
  articleCount?: number;
}

export interface CreateArticleTopicInterface {
  "@context": "/article_topics";
  name: string;
  whitelist: string[];
  blacklist: string[];
}

export interface UpdateArticleTopicInterface extends ApiPlatformItemResponse {
  name?: string;
  whitelist?: string[];
  blacklist?: string[];
}
