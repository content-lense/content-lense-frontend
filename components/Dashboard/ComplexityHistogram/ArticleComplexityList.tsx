import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";
import { ArticleComplexityListColumns } from "./ArticleComplexityListColumns";

export default function ArticleComplexityList() {
  const { data: articleData, isLoading } = useQuery(["articles"], () =>
    GenericGetItems<ArticleComplexityInterface[]>("/article_complexities")
  );

  console.log(isLoading, articleData, "artData");

  if (!articleData || isLoading) return <></>;
  let columns = ArticleComplexityListColumns;
  console.log(columns, "cols, rows", articleData);
  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid columns={columns} rows={articleData} />
      </Box>
    </>
  );
}
