import { ArticleInterface } from "./ArticleInterface";

export interface ArticleComplexityInterface{
    article: ArticleInterface;
    wienerSachtextIndex: number;
    readingTimeInMinutes: number;
    totalWords: number;
    part: string;
    meanWordsPerSentence: number;
    totalSentences: number;
    totalChars: number;
    meanCharsPerWord: number;
}