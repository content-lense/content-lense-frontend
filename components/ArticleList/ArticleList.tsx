import { GenericGetItems, GenericGetItemsAsHydra } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import {
  CircularProgress,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  List,
  OutlinedInput,
  Pagination,
  Stack,
  TablePagination,
  TextField,
  Typography,
} from "@mui/material";
import ArticleListItem from "./ArticleListItem";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { ApipFilterEncoder } from "../../helpers/ApiPlatform/apip-filter-encoder";
import ChipSelectFormField, { SelectOptionValue } from "../ChipSelectFormField";
import { ArticleTopicInterface } from "../../interfaces/ArticleTopicInterface";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

function ArticleList() {
  const { t } = useTranslation();
  const router = useRouter();
  const { topic } = router.query;


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const [topicsFilter, setTopicsFilter] = useState<SelectOptionValue<string>[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<SelectOptionValue<string>[]>([]);

  const [selectedChips, setSelectedChips] = useState<any[]>();

  const { data, isLoading } = useQuery(
    ["articles", [page, rowsPerPage, totalRowCount, searchString, topicsFilter, sentimentFilter]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addPageFilter({ itemsPerPage: rowsPerPage, page: page + 1 })
        .addSingleValueFilter("q", searchString)
        .addArrayFilter("articleTopics.id", topicsFilter)
        .addArrayFilter("sentimentOfText", sentimentFilter);
      return GenericGetItemsAsHydra<ArticleInterface>("/articles", filterEncoder);
    },
    {
      onSuccess(data) {
        setTotalRowCount(data["hydra:totalItems"] ?? 0);
      },
    }
  );
  const { data: topics, isLoading: topicsLoading } = useQuery(["topics"], () =>
    GenericGetItems<ArticleTopicInterface>("/article_topics")
  );

  function handlePageChange(page: number) {
    setPage(page);
  }
  function handleChangeRowsPerPage(value: string) {
    setRowsPerPage(parseInt(value));
    setPage(0);
  }
  const topicOptions = topics?.map((topic) => {
    return { value: topic.id, label: topic.name };
  })

  useEffect(() => {
    if (topic) {
      const idx = topicOptions?.find((option) => { return option.label == topic })
      if (idx) {
        setSelectedChips([idx]);
        setTopicsFilter([idx.value])
      }
    }
  }, [])
  return (
    <Stack>
      <Stack direction="row" alignItems="center" spacing={5}>
        <ChipSelectFormField<string>
          fullWidth
          textFieldLabel={t("Choose topics")}
          options={topicOptions}
          onChange={(val) => {
            setTopicsFilter(val);
            setPage(0);
          }}
          values={selectedChips}
        />
        <ChipSelectFormField<string>
          fullWidth
          textFieldLabel={t("Choose sentiment")}
          options={["1", "2", "3", "4", "5"].map((sentimentValue) => {
            return { value: sentimentValue, label: sentimentValue };
          })}
          onChange={(val) => {
            setSentimentFilter(val);
            setPage(0);
          }}
        />
        <FormControl sx={{ width: "75ch" }} variant="outlined">
          <InputLabel htmlFor="search">{t("Search")}</InputLabel>
          <OutlinedInput
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setTimeout(() => {
                setSearchString(e.target.value);
              }, 1000);
            }}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            label={t("Password")}
          />
        </FormControl>
      </Stack>
      {isLoading || !data ? (
        <CircularProgress />
      ) : (
        <List>
          {data ? (
            data["hydra:member"].map((a, idx) => (
              <Fragment key={a.id}>
                <ArticleListItem article={a} showTextComplexityChips />
                <Divider />
              </Fragment>
            ))
          ) : (
            <CircularProgress />
          )}
        </List>
      )}
      <TablePagination
        component="div"
        count={totalRowCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, page) => handlePageChange(page)}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e.target.value)}
      />
    </Stack>
  );
}

export default ArticleList;
