// INFO: This File is translated
import { Alert, Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import getConfig from "next/config";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";
import { logoutUser } from "../data/UserData";

const { publicRuntimeConfig } = getConfig();

export default function Page() {
  const { t } = useTranslation();

  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const confirmUser = async () => {
    if (!router || !router.query || !router.query.url) {
      return;
    }
    await logoutUser();
    const res = await fetch(publicRuntimeConfig.API_ENDPOINT + decodeURIComponent(router.query.url! as string), {
      headers: {
        "Content-Type": "application/ld+json",
      },
    });
    if (res.ok) {
      setSuccess(true);
      router.push("/login");
    } else {
      setSuccess(false);
    }
  };

  useEffect(() => {
    confirmUser();
  }, [router]);

  return (
    <Box sx={{ maxWidth: 400, margin: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography>{t("Please wait ... ")}</Typography>
        <Box sx={{ mt: 4 }}>
          {success === null && (
            <Alert severity="info">
              {t("We are checking your account ... ")}
            </Alert>
          )}
          {success === true && (
            <Alert severity="success">
              {t("We are redirecting you to the login.")}
            </Alert>
          )}
          {success === false && (
            <Alert severity="warning">
              {t("An error ocurred, please try again later.")}
            </Alert>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  /** @ts-ignore */
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
