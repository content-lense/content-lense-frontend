import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";
import { ArticleInterface } from "./ArticleInterface";

export interface MessageInterface extends Omit<ApiPlatformItemResponse, "@context"> {
    body?: any;
    header?: string;
    queueName?: string;
    createdAt?: Date;
    availableAt?: Date;
    deliveredAt?: Date;
}
