import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
import { getCurrentUser } from "../data/UserData";
import { ApiFetch } from "./ApiFetch";
import { AuthenticatedUserInterface } from "../interfaces/UserInterface";

export interface MyToken {
  name: string;
  roles: string[];
  exp: number;
  id: number;
}

export function getUserToken(): MyToken | false {
  const cookiesNew = new Cookies();
  const token = cookiesNew.get("jwt_hp");
  if (token) {
    const decoded = jwt_decode<MyToken>(token);
    return decoded;
  }
  return false;
}

async function getAuthenticatedUser() {
  const resp = await getCurrentUser();
  if (resp.status != 200) {
    return { authenticated: false, user: null };
  }
  let me = resp.ok ? await resp.json() : null;
  return { authenticated: resp.ok, user: me };
}

async function refreshToken() {
  const res = await ApiFetch("/auth/refresh_token", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: 1 }),
  });
  if (!res.ok) {
    return false;
  }
  const data = await res.json();
}

export const scheduleNextTokenRefresh = (): NodeJS.Timeout | null => {
  const token = getUserToken();
  if (token) {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeForRefresh = (token.exp - currentTime - 60) * 1000; //in miliseconds
    return setTimeout(async () => {
      await refreshToken();
      scheduleNextTokenRefresh();
    }, timeForRefresh);
  }
  return null;
};

export function useUser() {
  //const [cookies, setCookie] = useCookies();
  const [user, setUser] = useState<AuthenticatedUserInterface | null>(null);
  const [isAuthenticated, setIsAutenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refetchUser, setRefetchUser] = useState<boolean>(true);
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);

  function refetchUserNow() {
    setIsLoading(true);
    setIsAutenticated(isAuthenticated);
    setRefetchUser(!refetchUser);
  }

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setUser(user);
      setIsAutenticated(authenticated);
      setIsLoading(false);
      if (!authenticated) {
        return { user: null, authenticated: false };
      }
    }
    getUserDetails();
    if (refreshTimeout === null) {
      setRefreshTimeout(scheduleNextTokenRefresh());
    }
  }, [refetchUser]);

  return { user, isAuthenticated, isLoading, setUser, refetch: refetchUserNow };
}
