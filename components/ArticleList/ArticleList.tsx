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
import { ChangeEvent, Fragment, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { ApipFilterEncoder } from "../../helpers/ApiPlatform/apip-filter-encoder";

function ArticleList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");
  const { data, isLoading } = useQuery(
    ["articles", [page, rowsPerPage, totalRowCount, searchString]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addPageFilter({ itemsPerPage: rowsPerPage, page: page + 1 })
        .addSingleValueFilter("q", searchString);
      return GenericGetItemsAsHydra<ArticleInterface>("/articles", filterEncoder);
    },
    {
      onSuccess(data) {
        setTotalRowCount(data["hydra:totalItems"] ?? 0);
      },
    }
  );

  function handlePageChange(page: number) {
    setPage(page);
  }
  function handleChangeRowsPerPage(value: string) {
    setRowsPerPage(parseInt(value));
    setPage(0);
  }

  return (
    <Stack>
      <FormControl sx={{ m: 1, width: "25ch", alignSelf: "flex-end" }} variant="outlined">
        <InputLabel htmlFor="search">Suche</InputLabel>
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
          label="Password"
        />
      </FormControl>
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
