import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
  Stack,
} from "@mui/material";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TopicsTable from "../../components/Topics/TopicsTable";
import AddIcon from "@mui/icons-material/Add";
import EditTopicDialog from "../../components/Topics/EditTopicDialog";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems, GenericGetItemsAsHydra } from "../../data/ReactQueries";
import { ArticleTopicInterface } from "../../interfaces/ArticleTopicInterface";
import { useEffect, useState } from "react";
import { VennDiagram, VennSeries } from "reaviz";
import { ApiFetch } from "../../helpers/ApiFetch";
import { GridSortItem, GridSortModel } from "@mui/x-data-grid";
import { ApipFilterEncoder } from "../../helpers/ApiPlatform/apip-filter-encoder";
import { ApipOrder } from "../../helpers/ApiPlatform/apip-order-filter";
import { useTranslation } from "next-i18next";

const Topics: NextPage = () => {
  const { t } = useTranslation();
  const [filterValue, setFilterValue] = useState({ field: "", from: 0, to: 100 });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([{ field: "", sort: undefined }]);
  const {
    data: topics,
    isLoading,
    refetch: refetchTopics,
  } = useQuery(
    ["topics", [filterValue, page, pageSize, sortModel]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addRangeFilter(filterValue.field, { min: filterValue.from, max: filterValue.to })
        .addPageFilter({ itemsPerPage: pageSize, page: page + 1 })
        .addOrderFilter(
          sortModel?.[0].field ?? "",
          sortModel[0] && sortModel[0].field != "count"
            ? (sortModel[0].sort as ApipOrder)
            : undefined
        )
        .addOrderByRelationCountFilter(
          sortModel[0] && sortModel[0].field === "count" ? "articles" : "",
          sortModel[0] && sortModel[0].field === "count"
            ? (sortModel[0].sort as ApipOrder)
            : undefined,
          ["name", "articleCount", "whitelist", "blacklist"]
        );
      return GenericGetItemsAsHydra<ArticleTopicInterface>("/article_topics", filterEncoder);
    },
    {
      onSuccess(data) {
        setTotalRowCount(data["hydra:totalItems"] ?? 0);
      },
    }
  );
  const [isShowingEditTopicDialog, setIsShowingEditTopicDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopicInterface | undefined>();


  console.log("Topics", topics);
  return (
    <>
      <Stack spacing={2}>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{ alignSelf: "flex-end" }}
          onClick={() => setIsShowingEditTopicDialog(true)}
        >
          {t("Add")}
        </Button>
        <TopicsTable
          rows={topics ? topics["hydra:member"] ?? [] : []}
          onEdit={(e) => {
            setSelectedTopic(e);
            setIsShowingEditTopicDialog(true);
          }}
          pageSize={pageSize}
          page={page}
          rowCount={totalRowCount}
          onPageChange={setPage}
          onPageSizeChange={(val) => {
            setPageSize(val);
            setPage(0);
          }}
          handleSorting={(sortModel) => {
            setPage(0);
            sortModel.length > 0
              ? setSortModel(sortModel)
              : setSortModel([{ field: "", sort: undefined }]);
          }}
          loading={isLoading}
        />
      </Stack>
      <EditTopicDialog
        onClose={() => {
          setIsShowingEditTopicDialog(false);
          setSelectedTopic(undefined);
          refetchTopics();
        }}
        isOpen={isShowingEditTopicDialog}
        topic={selectedTopic}
      />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Topics;
