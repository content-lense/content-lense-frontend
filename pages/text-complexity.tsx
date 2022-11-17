import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Grid, Stack } from "@mui/material";
import React, { PureComponent, useEffect, useState } from "react";
import WienerSachtextIndexHistogram from "../components/Dashboard/ComplexityHistogram/WienerSachtextIndexHistogram";
import ReadingTimeHistogram from "../components/Dashboard/ComplexityHistogram/ReadingTimeHistogram";
import WordCountHistogram from "../components/Dashboard/ComplexityHistogram/WordCountHistogram";
import { DataGrid } from "@mui/x-data-grid";
import ArticleComplexityList from "../components/Dashboard/ComplexityHistogram/ArticleComplexityList";
import { useQuery } from "@tanstack/react-query";
import { RangeFilterChangedInterface } from "../components/Dashboard/ComplexityHistogram/RangeFilterComponent";
import { GenericGetItem, GenericGetItems, GenericGetItemsAsHydra } from "../data/ReactQueries";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../interfaces/ArticleComplexityInterface";
import { ApipFilterEncoder } from "../helpers/ApiPlatform/apip-filter-encoder";

const TextComplexity: NextPage = () => {
  const CHART_HEIGHT = 300;
  const [filterBoundaries, setFilterBoundaries] = useState({ field: "", from: 0, to: 100 });
  const [filterValue, setFilterValue] = useState({ field: "", from: 0, to: 100 });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sortModel, setSortModel] = useState([{ field: "", sort: "" }]);

  function onFilterChange(obj: RangeFilterChangedInterface) {
    setFilterValue(obj);
  }

  const { data: articleData, isLoading } = useQuery(
    ["article_complexities", [filterValue, page, pageSize, sortModel]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addRangeFilter(filterValue.field, { min: filterValue.from, max: filterValue.to })
        .addPageFilter({ itemsPerPage: pageSize, page: page + 1 })
        .addOrderFilter(
          sortModel[0] ? sortModel[0].field : "",
          sortModel[0] ? sortModel[0].sort : ""
        );
      return GenericGetItemsAsHydra<ArticleComplexityInterface>(
        "/article_complexities",
        filterEncoder
      );
    },
    {
      onSuccess(data) {
        setTotalRowCount(data["hydra:totalItems"] ?? 0);
      },
    }
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
  console.log(pageSize, "pageSize", page);
  return (
    <Stack spacing={4}>
      <Head>
        <title>Test</title>
      </Head>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ height: CHART_HEIGHT }}>
          <WienerSachtextIndexHistogram
            onClick={(rangeLowerBoundary, rangeUpperBoundary) =>
              setFilterBoundaries({
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
              setFilterBoundaries({
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
              setFilterBoundaries({
                field: "totalWords",
                from: rangeLowerBoundary,
                to: rangeUpperBoundary,
              })
            }
          />
        </Grid>
      </Grid>
      <ArticleComplexityList
        articleData={articleData ? articleData["hydra:member"] ?? [] : []}
        isLoading={isLoading}
        onRangeFilterChange={onFilterChange}
        rangeFilterValues={filterBoundaries}
        articleComplexityBoundaries={articleComplexityBoundaries ?? {}}
        onPageChange={setPage}
        onPageSizeChange={(val) => {
          setPageSize(val);
          setPage(0);
        }}
        pageSize={pageSize}
        page={page}
        rowCount={totalRowCount}
        handleSorting={(sortModel) => {
          setSortModel(sortModel);
          console.log(sortModel, "sortModel");
          setPage(0);
        }}
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
