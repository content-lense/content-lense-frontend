import { ArticleInterface } from "./ArticleInterface";


export interface ArticleComplexityNumberTypes{
  wienerSachtextIndex: number;
  readingTimeInMinutes: number;
  totalWords: number;
  meanWordsPerSentence: number;
  totalSentences: number;
  totalChars: number;
  meanCharsPerWord: number;
}

export interface ArticleComplexityInterface extends ArticleComplexityNumberTypes {
  article: ArticleInterface;
  part: string;
}
