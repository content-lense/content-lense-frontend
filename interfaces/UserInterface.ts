import { UserRoles } from "../enums/UserRoles";
import { ApiPlatformItemResponse } from "./ApiPlatformResponseInterface";


export interface UserLoginInterface {
    email: string;
    password: string;
}
export interface BaseUserInterface extends UserLoginInterface {
    
}
export interface UserSignupInterface extends BaseUserInterface {
    repeatPassword: string;
}

export interface InviteOrganisationMemberInterface {
    email: string;
}

export interface PublicUserInfoInterface extends ApiPlatformItemResponse {
    displayName: string;
    email: string;
}

export interface OrganisationTeamMemberInterface extends ApiPlatformItemResponse {
    displayName: string;
    email: string;
    isConfirmed: boolean;
}

export interface AuthenticatedUserInterface extends BaseUserInterface, ApiPlatformItemResponse {
    displayName: string;
    isActive: boolean;
    roles: Array<UserRoles>
    ownedOrganisation?: {
        id: string,
        ["@id"]: string,
    }
}