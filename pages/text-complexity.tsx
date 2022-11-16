import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Grid, Stack } from "@mui/material";
import React, { PureComponent, useState } from "react";
import WienerSachtextIndexHistogram from "../components/Dashboard/ComplexityHistogram/WienerSachtextIndexHistogram";
import ReadingTimeHistogram from "../components/Dashboard/ComplexityHistogram/ReadingTimeHistogram";
import WordCountHistogram from "../components/Dashboard/ComplexityHistogram/WordCountHistogram";
import { DataGrid } from "@mui/x-data-grid";
import ArticleComplexityList from "../components/Dashboard/ComplexityHistogram/ArticleComplexityList";
import { useQuery } from "@tanstack/react-query";
import { RangeFilterChangedInterface } from "../components/Dashboard/ComplexityHistogram/RangeFilterComponent";
import { GenericGetItem, GenericGetItems } from "../data/ReactQueries";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../interfaces/ArticleComplexityInterface";

const TextComplexity: NextPage = () => {
  const CHART_HEIGHT = 300;
  const [queryOptions, setQueryOptions] = useState({});
  const [filterValues, setFilterValues] = useState({ field: "", from: 0, to: 100 });

  function onFilterChange(obj: RangeFilterChangedInterface) {
    setQueryOptions({
      queryString: "?" + obj.field,
      rangeOperator: "between",
      rangeLowerBoundary: obj.from,
      rangeUpperBoundary: obj.to,
    });
  }

  const { data: articleData, isLoading } = useQuery(["articles", queryOptions], () =>
    GenericGetItems<ArticleComplexityInterface>("/article_complexities", queryOptions)
  );
  const { data: articleComplexityBoundaries, isLoading: articleComplexityBoundariesLoading } =
    useQuery(["articleBoundaries"], () =>
      GenericGetItem<{ [key in keyof ArticleComplexityNumberTypes]: [number, number] }>(
        "/article_complexity/boundary"
      )
    );
  if (!articleComplexityBoundaries) {
    return <></>;
  }

  return (
    <Stack spacing={4}>
      <Head>
        <title>Test</title>
      </Head>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <WienerSachtextIndexHistogram
            onClick={(rangeLowerBoundary, rangeUpperBoundary) =>
              setFilterValues({
                ...filterValues,
                field: "wienerSachtextIndex",
                from: rangeLowerBoundary,
                to: rangeUpperBoundary,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <ReadingTimeHistogram
            onClick={(rangeLowerBoundary, rangeUpperBoundary) =>
              setFilterValues({
                ...filterValues,
                field: "readingTimeInMinutes",
                from: rangeLowerBoundary,
                to: rangeUpperBoundary,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <WordCountHistogram
            onClick={(rangeLowerBoundary, rangeUpperBoundary) =>
              setFilterValues({
                ...filterValues,
                field: "totalWords",
                from: rangeLowerBoundary,
                to: rangeUpperBoundary,
              })
            }
          />
        </Grid>
      </Grid>
      <ArticleComplexityList
        articleData={articleData ?? []}
        isLoading={isLoading}
        onRangeFilterChange={onFilterChange}
        rangeFilterValues={filterValues}
        articleComplexityBoundaries={articleComplexityBoundaries ?? {}}
      />
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

export default TextComplexity;
