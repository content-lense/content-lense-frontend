import React, { ReactElement, ReactNode } from "react";
import "../styles/globals.css";
import "node_modules/highlight.js/styles/atom-one-dark.css";
import type { AppProps } from "next/app";
import AuthenticatedLayout from "../components/AuthenticatedLayout";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { appWithTranslation } from "next-i18next";
import { useUser } from "../helpers/useUser";
import { PwaContext } from "../helpers/PwaContext";
import { useRouter } from "next/router";
import { logoutUser } from "../data/UserData";
import LoadingScreen from "../components/LoadingScreen";
import { NextPage } from "next";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultQueryFn } from "../data/ReactQueries";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: any ) => any;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // @ts-ignore
      queryFn: DefaultQueryFn,
    }
  }
})

export const theme = createTheme({
  palette: {
    primary: {
      main: "#263238",
    },
    secondary: {
      main: "#26c6da",
      light: "#006064",
    },
    info: {
      main: "#4dd0e1",
    },
    success: {
      main: "#7cb342",
    },
    error: {
      main: "#ff1744",
    },
  },
});

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isLoadingUser, setUser, refetch } = useUser();

  function forceContextUserRefetch() {
    refetch();
  }

  async function logoutUserAndRedirectToLogin() {
    console.error("Logging out and redirecting");
    await logoutUser();
    router.push("/login");
    refetch();
  }

  if (isLoadingUser) return <LoadingScreen />;



  return (
    <CssBaseline>
      <ThemeProvider theme={theme}>
      <PwaContext.Provider
          value={{
            forceContextUserRefetch,
            logoutUserAndRedirectToLogin,
            user: user ?? null,
            isAuthenticated: isAuthenticated ?? null,
            isLoadingUser: isLoadingUser ?? null,
            updateUser: setUser,
          }}
        >
          <QueryClientProvider client={queryClient}>
           {Component.getLayout &&
              /*
              // @ts-ignore */
              Component.getLayout(<Component {...pageProps} />)}
            {!Component.getLayout && (
              <AuthenticatedLayout>
                {/*
                // @ts-ignore */}
                <Component {...pageProps} />
              </AuthenticatedLayout>
            )}
          </QueryClientProvider>
        </PwaContext.Provider>
      </ThemeProvider>
      
    </CssBaseline>
  );
}

export default appWithTranslation(App);
