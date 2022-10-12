import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";
import { PersonInterface } from "./PersonInterface";

interface ArticleMentionInterface extends ApiPlatformItemResponse{
    mentionCount: number;
    person: PersonInterface;
}

export interface ArticleInterface extends ApiPlatformItemResponse{
    url: string;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    language: string;
    title: string;
    abstract: string;
    image: string;
    organisation: string;
    authors: PersonInterface[];
    articleAnalysisResults: string[];
    mentionedPersons: ArticleMentionInterface[];
}



export interface CreateArticleInterface {
    "@context": "/articles"
    title: string;
    abstract: string;
    text: string;
}