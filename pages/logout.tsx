import { useTranslation } from "next-i18next";

import router, { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import LoadingScreen from "../components/LoadingScreen";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";
import { logoutUser } from "../data/UserData";
import { useUser } from "../helpers/useUser";

export default function Page() {
  useEffect(() => {
    const logout = async () => {
      await logoutUser();
      setTimeout(() => router.push("/login"), 2000);
    };
    logout();
  }, []);

  return <LoadingScreen />;
}

Page.getLayout = function getLayout(page: ReactElement) {
  /** @ts-ignore */
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};
