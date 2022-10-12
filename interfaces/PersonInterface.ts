import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export interface PersonInterface extends ApiPlatformItemResponse{
    firstName: string;
    lastName: string;
}