import { GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";

export const ArticleComplexityListColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100,
    editable: false,
  },
  {
    field: "part",
    headerName: "Part",
    width: 100,
    editable: false,
  },
];
