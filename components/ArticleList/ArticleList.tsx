import { GenericGetItems } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { CircularProgress, Divider, List, Typography } from "@mui/material";
import ArticleListItem from "./ArticleListItem";

function ArticleList() {
  const { data, isLoading } = useQuery(["articles"], () =>
    GenericGetItems<ArticleInterface>("/articles")
  );
  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <List>
      {data.map((a) => (
        <>
          <ArticleListItem article={a} showTextComplexityChips />
          <Divider />
        </>
      ))}
    </List>
  );
}

export default ArticleList;
