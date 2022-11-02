import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Stack } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../data/ReactQueries";
import { ArticleComplexityInterface } from "../interfaces/ArticleComplexityInterface";
import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import WienerSachtextIndexHistogram from "../components/Dashboard/ComplexityHistogram/WienerSachtextIndexHistogram";
import ReadingTimeHistogram from "../components/Dashboard/ComplexityHistogram/ReadingTimeHistogram";

const Home: NextPage = () => {
  return (
    <Stack>
      <Head>
        <title>Test</title>
      </Head>
      <WienerSachtextIndexHistogram />
      <ReadingTimeHistogram />
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
