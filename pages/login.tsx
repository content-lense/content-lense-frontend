// INFO: This File is translated
import { Alert, Box, Paper, Typography } from "@mui/material";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import router from "next/router";
import { ReactElement } from "react";
import LoginForm from "../components/Forms/LoginForm";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";
import { useUser } from "../helpers/useUser";

export default function Page() {
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, user } = useUser();

  if (isAuthenticated) {
    if (router.query.returnTo && typeof window !== "undefined") {
      window.location.href = router.query.returnTo! as string;
    }
    router.push("/entities/articles");

    return null;
  }

  return (
    <Box sx={{ maxWidth: 400, margin: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Box
          sx={{
            width: 160,
            height: 40,
            position: "relative",
            mb: 4,
          }}
        >
          <Image
            layout="fill"
            objectFit="contain"
            alt={t("Content Lense")}
            src="/images/logo.png"
          />
        </Box>

        <Typography variant="body1">{t("Login")}</Typography>
        <Box sx={{ mt: 4 }}>
          {isLoading && <Alert severity="info">{t("Please wait ... ")}</Alert>}
          {!isLoading && <LoginForm />}
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
