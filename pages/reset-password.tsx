// INFO: This File is translated
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import ResetPasswordForm from "../components/Forms/ResetPasswordForm";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;
  const email = query.email as string | null;

  return (
    <Box sx={{ maxWidth: 400, margin: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography>{t("Reset password")}</Typography>
        <Box sx={{ mt: 4 }}>
          <ResetPasswordForm email={email} />
        </Box>
      </Paper>
    </Box>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  //@ts-ignore
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
