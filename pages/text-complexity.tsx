import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Grid, Stack } from "@mui/material";
import React, { PureComponent } from "react";
import WienerSachtextIndexHistogram from "../components/Dashboard/ComplexityHistogram/WienerSachtextIndexHistogram";
import ReadingTimeHistogram from "../components/Dashboard/ComplexityHistogram/ReadingTimeHistogram";
import WordCountHistogram from "../components/Dashboard/ComplexityHistogram/WordCountHistogram";
import { DataGrid } from "@mui/x-data-grid";
import ArticleComplexityList from "../components/Dashboard/ComplexityHistogram/ArticleComplexityList";

const Home: NextPage = () => {
  const CHART_HEIGHT = 300;
  return (
    <Stack spacing={4}>
      <Head>
        <title>Test</title>
      </Head>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <WienerSachtextIndexHistogram />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <ReadingTimeHistogram />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <WordCountHistogram />
        </Grid>
      </Grid>
      <ArticleComplexityList />
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

export default Home;
