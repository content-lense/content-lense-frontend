import {
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
import TopicsTable from "../components/Topics/TopicsTable";
import AddIcon from "@mui/icons-material/Add";
import EditTopicDialog from "../components/Topics/EditTopicDialog";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems, GenericGetItemsAsHydra } from "../data/ReactQueries";
import { ArticleTopicInterface } from "../interfaces/ArticleTopicInterface";
import { useEffect, useState } from "react";
import { VennDiagram, VennSeries } from "reaviz";
import { ApiFetch } from "../helpers/ApiFetch";
import { GridSortItem, GridSortModel } from "@mui/x-data-grid";
import { ApipFilterEncoder } from "../helpers/ApiPlatform/apip-filter-encoder";
import { ApipOrder } from "../helpers/ApiPlatform/apip-order-filter";

const Topics: NextPage = () => {
  const [filterValue, setFilterValue] = useState({ field: "", from: 0, to: 100 });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortItem[]>([{ field: "", sort: undefined }]);
  const { data: topics, isLoading } = useQuery(
    ["topics", [filterValue, page, pageSize, sortModel]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addRangeFilter(filterValue.field, { min: filterValue.from, max: filterValue.to })
        .addPageFilter({ itemsPerPage: pageSize, page: page + 1 })
        .addOrderFilter(
          sortModel?.[0].field ?? "",
          sortModel[0] ? (sortModel[0].sort as ApipOrder) : undefined
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
  const [numOfTopics, setNumOfTopics] = useState<number>(6);

  const {
    data: vennData,
    isLoading: vennDataLoading,
    refetch: refetchVennData,
  } = useQuery(["vennData"], () =>
    ApiFetch(`/article_topics_venn?limit=${numOfTopics}`).then((req) => {
      return req.json();
    })
  );

  useEffect(() => {
    refetchVennData();
  }, [numOfTopics]);

  if (!vennData) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2}>
        <Slider
          sx={{ pt: 7 }}
          valueLabelDisplay="on"
          defaultValue={6}
          min={0}
          max={10}
          value={numOfTopics}
          onChange={(e, newValue: number | number[]) => setNumOfTopics(newValue as number)}
          aria-label="Disabled slider"
        />
        <Box width={"100%"}>
          <VennDiagram
            height={450}
            data={vennData}
            series={<VennSeries colorScheme={["#2d60e8"]} />}
          />
        </Box>

        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{ alignSelf: "flex-end" }}
          onClick={() => setIsShowingEditTopicDialog(true)}
        >
          Hinzufügen
        </Button>
        <TopicsTable
          topics={topics ? topics["hydra:member"] ?? [] : []}
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
            setSortModel(sortModel);
          }}
          isLoading={isLoading}
        />
      </Stack>
      <EditTopicDialog
        onClose={() => {
          setIsShowingEditTopicDialog(false);
          setSelectedTopic(undefined);
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
