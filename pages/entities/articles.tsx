import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  Api,
  ExpandMore,
  Input,
  Javascript,
  JavascriptOutlined,
  PhpOutlined,
} from "@mui/icons-material";
import Image from "next/image";

import "node_modules/highlight.js/styles/atom-one-dark.css";
import Highlight from "react-highlight";
import ArticleList from "../../components/ArticleList/ArticleList";
import CreateArticleForm from "../../components/Forms/CreateArticleForm";
import { useTranslation } from "next-i18next";
import { ArticleInterface, CreateArticleInterface } from "../../interfaces/ArticleInterface";
import CodeExample from "../../components/CodeExample/CodeExample";



const Articles: NextPage = () => {
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Stack>
      <Head>
        <title>{t("Articles")}</title>
      </Head>

      <Typography variant="h4">{t("Article list")}</Typography>
      <ArticleList />
      <Typography variant="h4">{t("Add a new article")}</Typography>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack flexDirection="row" gap={1}>
            <Input />
            <Typography>{t("Manually using a form")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <CreateArticleForm />
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Stack flexDirection="row" gap={1}>
            <Api />
            <Typography>{t("Automatic using the api")}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <CodeExample<CreateArticleInterface, any, ArticleInterface>
            markdown={"# Title *Hello World*"}
            iri={{ entity: "articles", id: "alkgh4qn49nw49naw9n9twankasja4utnanssds" }}
            properties={{
              post: {
                "@context": "/articles",
                abstract: "Abstract",
                text: "Text",
                title: "Title"
              },
              get: true,
              delete: true,
            }} />
        </AccordionDetails>
      </Accordion>
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
