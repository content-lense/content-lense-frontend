import { Box, Chip, IconButton } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../data/ReactQueries";
import { ArticleTopicInterface } from "../../interfaces/ArticleTopicInterface";
import EditIcon from "@mui/icons-material/Edit";
import DataGridTable, { DataGridTablePropsInterface } from "../DataGridTable";

const columns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
  },
  {
    field: "count",
    headerName: "Anzahl Artikel",
    sortable: false,
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.articles.length,
  },
  {
    field: "whitelist",
    headerName: "Whitelist Keywords",
    sortable: false,
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.whitelist.map((keyword: string) => {
        return <Chip label={keyword} />;
      }),
  },
  {
    field: "blacklist",
    headerName: "Blacklist Keywords",
    sortable: false,
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.blacklist.map((keyword: string) => {
        return <Chip label={keyword} />;
      }),
  },
  {
    field: "edit",
    headerName: "Edit",
    sortable: false,
    type: "actions",
    renderCell: (params: GridRenderCellParams<string>) => (
      <IconButton>
        <EditIcon />
      </IconButton>
    ),
  },
  //   {
  //     field: "action",
  //     type: "actions",
  //     getActions: (params) => [
  //       <>
  //         <GridActionsCellItem
  //           icon={<EditIcon />}
  //           onClick={() => console.log("clicked")}
  //           label="Bearbeiten"
  //         />
  //       </>,
  //     ],
  //   },
];

interface TopicsTablePropsInterface
  extends Pick<
    DataGridTablePropsInterface,
    | "pageSize"
    | "page"
    | "rowCount"
    | "onPageChange"
    | "onPageSizeChange"
    | "handleSorting"
    | "isLoading"
  > {
  topics: ArticleTopicInterface[];
  onEdit: (topic: ArticleTopicInterface) => void;
}

export default function TopicsTable(props: TopicsTablePropsInterface) {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      {/* <DataGrid
        columns={columns}
        loading={!props.topics}
        rows={props.topics ?? []}
        onCellClick={(e) => {
          e.field === "edit" && props.onEdit(e.row);
        }}
      /> */}
      <DataGridTable
        rows={props.topics}
        columns={columns}
        isLoading={props.isLoading}
        pageSize={props.pageSize}
        page={props.page}
        rowCount={props.rowCount}
        onPageChange={props.onPageChange}
        onPageSizeChange={props.onPageSizeChange}
        handleSorting={props.handleSorting}
      />
    </Box>
  );
}
