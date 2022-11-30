import { Alert, Chip, CircularProgress, LinearProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../data/ReactQueries";
import { ApipFilterEncoder } from "../../helpers/ApiPlatform/apip-filter-encoder";
import {
  ArticleAnalysisResultInterface,
  ArticleAnalysisResultStatus,
} from "../../interfaces/ArticleAnalysisResultInterface";
import DoneIcon from "@mui/icons-material/Done";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

function AnalysisPipeline(props: { articleId: string }) {
  const {
    data: articleAnalysisResults,
    isLoading,
    refetch,
  } = useQuery(
    ["article_analysis_results_pipeline", props.articleId],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder.addSingleValueFilter("article", props.articleId);
      return GenericGetItems<ArticleAnalysisResultInterface>(
        "/article_analysis_results",
        filterEncoder
      );
    },
    {
      onSuccess(data) {
        // Trigger refetch if there are results that are not yet done:
        if (
          data.filter(
            (a) =>
              a.status !== ArticleAnalysisResultStatus.DONE &&
              a.status !== ArticleAnalysisResultStatus.DISABLED &&
              a.status !== ArticleAnalysisResultStatus.FAILED
          ).length > 0
        ) {
          setTimeout(() => {
            refetch();
          }, 5000);
        }
      },
    }
  );

  if (!articleAnalysisResults) return <></>;

  const numLoading = articleAnalysisResults.filter(
    (a) =>
      a.status !== ArticleAnalysisResultStatus.DONE &&
      a.status !== ArticleAnalysisResultStatus.DISABLED &&
      a.status !== ArticleAnalysisResultStatus.FAILED
  ).length;
  const numDone = articleAnalysisResults.length - numLoading;

  const getColorByStatus = (status: ArticleAnalysisResultStatus) => {
    switch (status) {
      case ArticleAnalysisResultStatus.DONE:
        return "success";
      case ArticleAnalysisResultStatus.PUSHED:
        return "info";
      case ArticleAnalysisResultStatus.DISABLED:
        return "default";
      case ArticleAnalysisResultStatus.RETRIED_PROCESSING:
        return "warning";
      case ArticleAnalysisResultStatus.FAILED:
        return "error";
      default:
        return "info";
    }
  };
  return (
    <Stack direction="row" gap={2} maxWidth={800} flexWrap={"wrap"}>
      {articleAnalysisResults.length === 0 && (
        <Alert severity="info">Es wurden keine Analysen ausgeführt.</Alert>
      )}
      {numLoading > 0 && <LinearProgress />}
      {articleAnalysisResults.map((a) => (
        <Stack direction="row">
          <Chip
            icon={
              a.status === ArticleAnalysisResultStatus.DONE ? <DoneIcon /> : <HourglassTopIcon />
            }
            label={a.analysisMicroserviceName + ": " + a.status}
            color={getColorByStatus(a.status)}
          />
        </Stack>
      ))}
    </Stack>
  );
}

export default AnalysisPipeline;
