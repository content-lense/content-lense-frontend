import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  OutlinedInput,
  Slider,
  Stack,
  TablePagination,
} from "@mui/material";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TopicsTable from "../components/Topics/TopicsTable";
import AddIcon from "@mui/icons-material/Add";
import EditTopicDialog from "../components/Topics/EditTopicDialog";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems, GenericGetItemsAsHydra } from "../data/ReactQueries";
import { ArticleTopicInterface } from "../interfaces/ArticleTopicInterface";
import { Fragment, useEffect, useState } from "react";
import { VennDiagram, VennSeries } from "reaviz";
import { ApiFetch } from "../helpers/ApiFetch";
import { GridSortItem, GridSortModel } from "@mui/x-data-grid";
import { ApipFilterEncoder } from "../helpers/ApiPlatform/apip-filter-encoder";
import { ApipOrder } from "../helpers/ApiPlatform/apip-order-filter";
import EntityRowsWrapper from "../components/generator/EntityRowsWrapper";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "next-i18next";

const Topics: NextPage = () => {
  const { t } = useTranslation();

  const [numOfTopics, setNumOfTopics] = useState<number>(6);
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const router = useRouter();

  const {
    data: vennData,
    isLoading: vennDataLoading,
    refetch: refetchVennData,
  } = useQuery(["vennData"], () =>
    ApiFetch(`/article_topics_venn?limit=${numOfTopics}`).then((req) => {
      return req.json();
    })
  );

  function handlePageChange(_page: number) {
    console.log("pageinside: ", _page)
    setPage(_page);
  }
  function handleChangeRowsPerPage(value: string) {
    setRowsPerPage(parseInt(value));
    setPage(0);
  }

  const filterEncoder = new ApipFilterEncoder();
  filterEncoder
    .addPageFilter({ itemsPerPage: rowsPerPage, page: page + 1 })
    .addSingleValueFilter("q", searchString)

  useEffect(() => {
    refetchVennData();
  }, [numOfTopics]);

  if (!vennData) {
    return <></>;
  }
  return (
    <>
      <Stack spacing={2}>
        <Alert severity="info">
          {t("{{numOfTopics}} topics are displayed sorted by the number of artlces. Topics can overlap as an article can be assigned to several topics. The number of topics (max 10) can be changed with the slider.", { numOfTopics: numOfTopics })}
        </Alert>
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
        <FormControl sx={{ width: "400px" }} variant="outlined">
          <InputLabel htmlFor="search">{t("Search")}</InputLabel>
          <OutlinedInput
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchString(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            label={t("Search")}
          />
        </FormControl>
        <EntityRowsWrapper<ArticleTopicInterface> additionalCacheProperties={totalRowCount.toString()} path="article_topics" filters={filterEncoder} onSuccess={(totalLength) => setTotalRowCount(totalLength)} >
          {(topics) =>
          (
            <List>{topics.map((topic) => {
              return (
                <Fragment key={topic.id}>
                  <ListItem>
                    <Stack direction={"row"} spacing={1}>
                      <ListItemButton onClick={() => {
                        router.push({ pathname: "entities/articles", query: { topic: topic.name } })
                      }}>
                        <ListItemText secondary={topic.articleCount} primary={topic.name} sx={{ pr: 2 }} />
                      </ListItemButton>
                    </Stack>
                  </ListItem>
                  <Divider />
                </Fragment>
              );
            })}
            </List>
          )
          }
        </EntityRowsWrapper>
        <TablePagination
          component="div"
          count={totalRowCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, _page) => { handlePageChange(_page) }}
          onRowsPerPageChange={(e) => handleChangeRowsPerPage(e.target.value)}
        />
      </Stack>
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
