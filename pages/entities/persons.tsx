import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Stack, Typography } from "@mui/material";
import PersonList from "../../components/PersonList/PersonList";

const Persons: NextPage = () => {
  return (
    <Stack>
      <Head>
        <title>Persons</title>
      </Head>
      <Typography variant="h4">Person list</Typography>
      <PersonList />
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

export default Persons;
