import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";

export const enum Gender {
  FEMALE = "female",
  MALE = "male",
  UNKNOWN = "unknown",
}

export interface PersonInterface extends ApiPlatformItemResponse {
  firstName: string;
  lastName: string;
  age?: number;
  gender?: Gender;
}

export interface UpdatePersonInterface extends Partial<Omit<PersonInterface, keyof ApiPlatformItemResponse>>, ApiPlatformItemResponse {
}

export interface CreatePersonInterface extends Omit<PersonInterface, keyof Omit<ApiPlatformItemResponse, "@context">> { }