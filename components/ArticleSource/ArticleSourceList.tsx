import { GenericGetItems } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";

import { CircularProgress, Divider, List, Typography } from "@mui/material";
import ArticleSourceListItem from "./ArticleSourceListItem";
import { ArticleSourceInterface } from "../../interfaces/ArticleSourceInterface";

function ArticleSourceList() {
  const { data, isLoading } = useQuery(["article_sources"], () =>
    GenericGetItems<ArticleSourceInterface>("/article_sources")
  );
  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <List>
      {data.map((a) => (
        <>
          <ArticleSourceListItem articleSource={a} />
          <Divider />
        </>
      ))}
    </List>
  );
}

export default ArticleSourceList;
