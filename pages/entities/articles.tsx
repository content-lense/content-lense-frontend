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

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 0,
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

const Articles: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Stack>
      <Head>
        <title>Articles</title>
      </Head>

      <Typography variant="h4">Article list</Typography>
      <ArticleList />
      <Typography variant="h4">Add a new article</Typography>

      <Accordion sx={{ mt: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack flexDirection="row" gap={1}>
            <Input />
            <Typography>Manually using a form</Typography>
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
            <Typography>Automatic using the api</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Stack>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={selectedTab} onChange={(e, value) => setSelectedTab(value)}>
                <Tab icon={<Image width={32} height={32} src="/icons/js.png" />} />
                <Tab icon={<Image width={32} height={32} src="/icons/php.png" />} />
                <Tab icon={<Image width={32} height={32} src="/icons/python.png" />} />
              </Tabs>
            </Box>
            <TabPanel value={selectedTab} index={0}>
              <Highlight className="js">{`fetch("https://localhost:3001/articles?apiKey=YOUR_API_KEY", {
  method: "PUT",
  body: JSON.stringify({
    headline: "ARTICLE HEADLINE",
    body: "ARTICLE BODY",
    publishedAt: ""
  }),
  headers: { "Content-Type": "application/json" },
}).then((yourAticle) => {
  // Put suceeding code here
})`}</Highlight>
            </TabPanel>
            <TabPanel value={selectedTab} index={1}>
              Item Two
            </TabPanel>
            <TabPanel value={selectedTab} index={2}>
              Item Three
            </TabPanel>
          </Stack>
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
