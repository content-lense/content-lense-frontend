export enum ArticleAnalysisResultStatus {
    PUSHED = "PUSHED",
    PROCESSING = "PROCESSING",
    RETRIED_PROCESSING = "RETRIED_PROCESSING",
    PROCESSED = "PROCESSED",
    POST_PROCESSING = "POST_PROCESSING",
    DONE = "DONE",
    FAILED = "FAILED",
    DISABLED = "DISABLED"
}
export interface ArticleAnalysisResultInterface {
    id: string;
    status: ArticleAnalysisResultStatus;
    analysisMicroservice: string;
    analysisMicroserviceName: string;
}