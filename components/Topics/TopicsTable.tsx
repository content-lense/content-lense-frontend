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
    width: 150,
    valueGetter: (params: GridValueGetterParams) => params.row.articleCount,
  },
  {
    field: "whitelist",
    headerName: "Whitelist Keywords",
    sortable: false,
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.whitelist.map((keyword: string, idx: number) => {
        return <Chip key={idx} label={keyword + "-" + idx} />;
      }),
  },
  {
    field: "blacklist",
    headerName: "Blacklist Keywords",
    sortable: false,
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.blacklist.map((keyword: string, idx: number) => {
        return <Chip label={keyword} key={keyword + "-" + idx} />;
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

interface TopicsTablePropsInterface extends Omit<DataGridTablePropsInterface, "columns"> {
  onEdit: (topic: ArticleTopicInterface) => void;
}

export default function TopicsTable(props: TopicsTablePropsInterface) {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGridTable
        rows={props.rows}
        columns={columns}
        loading={props.loading}
        pageSize={props.pageSize}
        page={props.page}
        rowCount={props.rowCount}
        onPageChange={props.onPageChange}
        onPageSizeChange={props.onPageSizeChange}
        handleSorting={props.handleSorting}
        onCellClick={(e) => {
          e.field === "edit" && props.onEdit(e.row);
        }}
      />
    </Box>
  );
}
