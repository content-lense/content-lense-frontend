import { ArticleInterface } from "./ArticleInterface";

export interface ArticleComplexityInterface{
    article: ArticleInterface;
    wienerSachtextIndex: number;
    readingTimeInMinutes: number;
    totalWords: number;
    part: string;
}