import { GenericGetItems, GenericGetItemsAsHydra } from "../../data/ReactQueries";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { CircularProgress, Divider, FormControl, InputAdornment, InputLabel, List, OutlinedInput, TablePagination, Typography } from "@mui/material";
import PersonListItem from "./PersonListItem";
import { PersonInterface } from "../../interfaces/PersonInterface";
import { Fragment, useState } from "react";
import { SelectOptionValue } from "../ChipSelectFormField";
import { ApipFilterEncoder } from "../../helpers/ApiPlatform/apip-filter-encoder";

interface PersonListProps {
  searchString: string;
  filter?: string;
}

function PersonList(props: PersonListProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRowCount, setTotalRowCount] = useState(0);


  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(["persons", [page, rowsPerPage, totalRowCount, props.searchString, props.filter]],
    () => {
      const filterEncoder = new ApipFilterEncoder();
      filterEncoder
        .addPageFilter({ itemsPerPage: rowsPerPage, page: page + 1 })
        .addSingleValueFilter("q", props.searchString)
      props.filter && props.filter !== "none" &&
        filterEncoder.addSingleValueFilter(props.filter, true)
      return GenericGetItemsAsHydra<PersonInterface>("/people", filterEncoder);
    },
    {
      onSuccess(data) {
        setTotalRowCount(data["hydra:totalItems"] ?? 0);
      },
    }

  );

  function handlePageChange(_page: number) {
    console.log("pageinside: ", _page)
    setPage(_page);
  }
  function handleChangeRowsPerPage(value: string) {
    setRowsPerPage(parseInt(value));
    setPage(0);
  }

  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <>


      <List>
        {data ? data["hydra:member"].map((p) => (
          <Fragment key={p.id}>
            <PersonListItem person={p} />
            <Divider />
          </Fragment>
        )) : (<CircularProgress />)}
      </List>

      <TablePagination
        component="div"
        count={totalRowCount}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, _page) => { console.log("pagechange: ", _page); handlePageChange(_page) }}
        onRowsPerPageChange={(e) => handleChangeRowsPerPage(e.target.value)}
      />
    </>
  );
}

export default PersonList;
