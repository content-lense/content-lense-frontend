import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Box, Divider, Grid, List } from "@mui/material";
import React, { PureComponent, useEffect, useState } from "react";
import { DashboardKpiCard } from "../components/Dashboard/Startpage/DashboardKpiCard";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItem, GenericGetItems, GenericGetItemsAsHydra } from "../data/ReactQueries";
import { ArticleInterface } from "../interfaces/ArticleInterface";
import { ApipFilterEncoder } from "../helpers/ApiPlatform/apip-filter-encoder";
import { ApipOrder } from "../helpers/ApiPlatform/apip-order-filter";
import { ApiPlatformResponse } from "../interfaces/ApiPlatformResponseInterface";
import DashboardCard from "../components/Dashboard/Startpage/DashboardCard";
import ArticleListItem from "../components/ArticleList/ArticleListItem";

const Home: NextPage = () => {
  const now = new Date();
  const prior = new Date().setDate(now.getDate() - 30);
  const thirtyDaysAgo = new Date(prior);

  const { data: articlesLastThirtyDays, isLoading } = useQuery(
    ["articles", "addedLastThirtyDays"],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addDateFilter("createdAt", { after: thirtyDaysAgo })
        .addArrayFilter("properties", ["createdAt"]);
      return GenericGetItems<ArticleInterface>("/articles", filterEncoder);
    }
  );

  const { data: tenLastAddedArticles } = useQuery(["articles", "tenLastAddedArticles"], () => {
    const filterEncoder = new ApipFilterEncoder();
    filterEncoder.addOrderFilter("createdAt", ApipOrder.DESC).addPageFilter(10);
    return GenericGetItemsAsHydra<ArticleInterface>("/articles", filterEncoder);
  });

  if (!articlesLastThirtyDays || !tenLastAddedArticles) return <></>;
  console.log(tenLastAddedArticles, "ten");
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <DashboardKpiCard
          heading={"Hinzugefügte Artikel"}
          value={articlesLastThirtyDays?.length}
          total={tenLastAddedArticles?.["hydra:totalItems"]}
          dayCount={30}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        <DashboardCard
          title="Zuletzt hinzugefügte Artikel"
          isScrollable={true}
          scrollElementHeight={250}
        >
          <List>
            {tenLastAddedArticles["hydra:member"].map((a) => (
              <>
                <ArticleListItem article={a} />
                <Divider />
              </>
            ))}
          </List>
        </DashboardCard>
      </Grid>
    </Grid>
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
