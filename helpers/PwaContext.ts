import { Dispatch } from "react";
import { SetStateAction } from "react";
import { createContext } from "react";
import { AuthenticatedUserInterface } from "../interfaces/UserInterface";

export interface PwaContextInterface {
  logoutUserAndRedirectToLogin: () => void;
  forceContextUserRefetch: () => void;
  updateUser: Dispatch<SetStateAction<AuthenticatedUserInterface | null>>;
  user: AuthenticatedUserInterface | null;
  isLoadingUser: boolean | null;
  isAuthenticated: boolean | null;
}

export const PwaContext = createContext<PwaContextInterface>({} as PwaContextInterface);
