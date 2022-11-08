// INFO: This File is translated
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { GetStaticPaths } from "next";
import { useRouter } from "next/router";
import { Chip, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItem } from "../../../data/ReactQueries";
import { ArticleInterface } from "../../../interfaces/ArticleInterface";
import { useTranslation } from "next-i18next";

export default function Page() {
  const router = useRouter();
  const query = router.query;
  const articleId = query.articleId as string;

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

      <Stack gap={5} sx={{ maxWidth: 800 }}>
        <Stack>
          <Typography variant="h4">{article.title}</Typography>
        </Stack>
        <Stack>
          <Typography variant="h5">Abstract</Typography>
          <Typography variant="body1">{article.abstract}</Typography>
        </Stack>
        <Stack>
          <Typography variant="h5">Authors</Typography>
          <Stack direction="row" gap={2}>
            {article.authors &&
              article.authors.map(({ id, firstName, lastName }) => (
                <Chip key={id} label={`${firstName} ${lastName}`} />
              ))}
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          <Typography variant="h5">Mentioned people</Typography>
          <Stack direction="row" gap={2}>
            {article.mentionedPersons &&
              article.mentionedPersons.map(
                ({ id, mentionCount, person: { lastName, firstName } }) => (
                  <Chip key={id} label={`${firstName} ${lastName} (${mentionCount}x)`} />
                )
              )}
          </Stack>
        </Stack>
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
