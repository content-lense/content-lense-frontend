import { Box, Chip, IconButton } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumns,
  GridRenderCellParams,
  GridRowParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../data/ReactQueries";
import { ArticleTopicInterface } from "../../interfaces/ArticleTopicInterface";
import EditIcon from "@mui/icons-material/Edit";

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
    valueGetter: (params: GridValueGetterParams) => params.row.articles.length,
  },
  {
    field: "whitelist",
    headerName: "Whitelist Keywords",
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.whitelist.map((keyword: string) => {
        return <Chip label={keyword} />;
      }),
  },
  {
    field: "blacklist",
    headerName: "Blacklist Keywords",
    width: 420,
    renderCell: (params: GridRenderCellParams<string>) =>
      params.row.blacklist.map((keyword: string) => {
        return <Chip label={keyword} />;
      }),
  },
  {
    field: "edit",
    headerName: "Edit",
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

interface TopicsTablePropsInterface {
  topics: ArticleTopicInterface[];
  onEdit: (topic: ArticleTopicInterface) => void;
}

export default function TopicsTable(props: TopicsTablePropsInterface) {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        columns={columns}
        loading={!props.topics}
        rows={props.topics ?? []}
        onCellClick={(e) => {
          props.onEdit(e.row);
        }}
      />
    </Box>
  );
}
