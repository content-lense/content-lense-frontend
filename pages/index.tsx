import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  List,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/material";
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
import { MessageInterface } from "../interfaces/MessageInterface";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ApiFetch } from "../helpers/ApiFetch";
import EntityWrapper from "../components/generator/EntityWrapper";
import { AnalysisMicroserviceInterface } from "../interfaces/AnalysisMicroserviceInterface";
import moment from "moment";

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
    filterEncoder.addOrderFilter("createdAt", ApipOrder.DESC).addPageFilter({ itemsPerPage: 10 });
    return GenericGetItemsAsHydra<ArticleInterface>("/articles", filterEncoder);
  });

  const { data: messages, isLoading: messagesLoading } = useQuery(["messages"], () =>
    GenericGetItems<MessageInterface>("/messenger_messages")
  );

  if (!articlesLastThirtyDays || !tenLastAddedArticles) return <></>;

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
      {/* messenger stats */}
      <Grid item xs={20} md={100}>
        <DashboardCard
          title="Zuletzt hinzugefügte Messages"
          isScrollable={true}
          scrollElementHeight={500}
        >
          <List>
            {messages?.map((message) => {
              return (
                <>
                  <Card>
                    <CardHeader
                      title={
                        <EntityWrapper<ArticleInterface>
                          path={"articles"}
                          id={message.body["articleId"]}
                          properties={["title"]}
                        >
                          {(item) => <Typography variant="h6">{item.title}</Typography>}
                        </EntityWrapper>
                      }
                      subheader={
                        <Stack direction="row" spacing={2}>
                          <Chip
                            size="small"
                            label={moment(message.availableAt).format("DD.MM.yyyy HH:mm")}
                          />
                          <Chip
                            size="small"
                            label={moment(message.createdAt).format("DD.MM.yyyy HH:mm")}
                          />
                          <Chip
                            size="small"
                            label={moment(message.deliveredAt).format("DD.MM.yyyy HH:mm")}
                          />
                        </Stack>
                      }
                      action={
                        <Chip
                          icon={
                            message.queueName === "failed" ? <CancelIcon /> : <CheckCircleIcon />
                          }
                          size="small"
                          color={message.queueName === "failed" ? "error" : "success"}
                          label={message.queueName}
                        />
                      }
                    ></CardHeader>
                    <CardContent>
                      <Stack direction="column">
                        <EntityWrapper<AnalysisMicroserviceInterface>
                          path={"analysis_microservices"}
                          id={message.body["analysisMicroserviceId"]}
                          properties={["title"]}
                        >
                          {(item) => <Typography variant="body1">{item.name}</Typography>}
                        </EntityWrapper>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Divider />
                </>
              );
            })}
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
