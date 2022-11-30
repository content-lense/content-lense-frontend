// INFO: This File is translated
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import {
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  Stack,
  Typography,
  IconButton,
  Alert,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItem } from "../../../data/ReactQueries";
import { ArticleInterface } from "../../../interfaces/ArticleInterface";
import { useTranslation } from "next-i18next";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import SentimentChip from "../../../components/SentimentChip/SentimentChip";
import AnalysisPipeline from "../../../components/AnalysisPipeline/AnalysisPipeline";
import EntityWrapper from "../../../components/generator/EntityWrapper";
import { ArticleAnalysisResultInterface } from "../../../interfaces/ArticleAnalysisResultInterface";

export default function Page() {
  const router = useRouter();
  const query = router.query;
  const articleId = query.articleId as string;
  const [showFulltext, setShowFulltext] = useState(false);

  const { data: article, isLoading: articleLoading } = useQuery(["articles", articleId], () =>
    GenericGetItem<ArticleInterface>("/articles/" + articleId)
  );
  if (articleLoading || !article) {
    return <CircularProgress />;
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>

      <Box>
        {article.image && <img src={article.image} style={{ maxWidth: 400, float: "right" }} />}
      </Box>

      <Stack gap={3} sx={{ maxWidth: 800 }}>
        <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
          <Typography variant="h4">{article.title}</Typography>
          {article.sentimentOfHeading && <SentimentChip sentiment={article.sentimentOfHeading} />}
        </Stack>
        <Stack direction="row" spacing={1}>
          {article.articleTopics &&
            article.articleTopics.map((topic) => <Chip key={topic["@id"]} label={topic.name} />)}
        </Stack>
        <Stack>
          <Typography variant="h5">Analyses Pipeline</Typography>
        </Stack>
        <AnalysisPipeline articleId={article["@id"]} />
        <Stack>
          <Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
            <Typography variant="h5">Abstract</Typography>
            {article.sentimentOfAbstract && (
              <SentimentChip sentiment={article.sentimentOfAbstract} />
            )}
          </Stack>
          <Typography variant="body1">{article.abstract}</Typography>
        </Stack>
        <Stack>
          <Stack direction="row" justifyContent={"space-between"}>
            <Typography variant="h5">Text</Typography>
            <Stack direction="row" gap={2}>
              {article.sentimentOfText && <SentimentChip sentiment={article.sentimentOfText} />}
              <IconButton onClick={() => setShowFulltext(!showFulltext)}>
                {showFulltext ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Stack>
          </Stack>
          <Collapse in={showFulltext}>
            <Typography variant="body1">{article.text}</Typography>
          </Collapse>
        </Stack>
        <Stack>
          <Typography variant="h5">Autoren</Typography>
          {!article.authors ||
            (article.authors.length === 0 && (
              <Alert severity="info">Keine Autoren zugeordnet.</Alert>
            ))}
          <Stack direction="row" gap={2}>
            {article.authors &&
              article.authors.map(({ id, firstName, lastName }) => (
                <Chip key={id} label={`${firstName} ${lastName}`} />
              ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Typography variant="h5">Erwähnte Personen</Typography>
          {!article.mentionedPersons ||
            (article.mentionedPersons.length === 0 && (
              <Alert severity="info">Keine Personen zugeordnet.</Alert>
            ))}
          <Stack direction="row" gap={2}>
            {article.mentionedPersons &&
              article.mentionedPersons.map(
                ({ id, mentionCount, person: { lastName, firstName } }) => (
                  <Chip key={id} label={`${firstName} ${lastName} (${mentionCount}x)`} />
                )
              )}
          </Stack>
        </Stack>
        <Divider />
        {article.complexities && article.complexities.length > 0 && (
          <Stack>
            <Typography variant="h5">Text complexity</Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Wiener-Sachtextindex</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].wienerSachtextIndex : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Lesezeit in Minuten</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].readingTimeInMinutes : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Satzanzahl</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].totalSentences : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Wortanzahl</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].totalWords : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Zeichenanzahl</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].totalChars : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>⌀ Wörter pro Satz</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].meanWordsPerSentence : "-"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>⌀ Zeichen pro Wort</TableCell>
                  <TableCell>
                    {article.complexities[0] ? article.complexities[0].meanCharsPerWord : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Stack>
        )}
      </Stack>
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
