import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Stack } from "@mui/material";
import { useTranslation } from "next-i18next";

const Articles: NextPage = () => {
  const { t } = useTranslation();
  return (
    <Stack>
      <Head>
        <title>{t("Settings")}</title>
      </Head>
    </Stack>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Articles;
