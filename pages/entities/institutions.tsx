import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Stack } from "@mui/material";

const Articles: NextPage = () => {
  return (
    <Stack>
      <Head>
        <title>Settings</title>
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
