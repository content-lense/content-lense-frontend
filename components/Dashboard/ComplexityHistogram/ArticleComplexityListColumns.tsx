import { Article } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { GridColDef, GridRenderCellParams, GridValueFormatterParams } from "@mui/x-data-grid";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../../../interfaces/ArticleComplexityInterface";

export interface NumberGridColDef extends Omit<GridColDef, "field"> {
  field: keyof ArticleComplexityNumberTypes;
}

export interface RestrictedGridColDef extends Omit<GridColDef, "field"> {
  field: keyof ArticleComplexityInterface | "details";
}

export const ArticleComplexityListColumns: RestrictedGridColDef[] = [
  {
    field: "details",
    headerName: "",
    sortable: false,
    type: "actions",
    width: 50,
    renderCell: (params: GridRenderCellParams<string>) => (
      <IconButton>
        <Article />
      </IconButton>
    ),
  },
  {
    field: "article",
    headerName: "title",
    width: 200,
    type: "string",
    editable: false,
    valueGetter: (params) => {
      return params.row.article.title;
    },
  },
  {
    field: "wienerSachtextIndex",
    headerName: "Wiener-Sachtextindex",
    width: 160,
    type: "number",
    editable: false,
  },
  {
    field: "readingTimeInMinutes",
    headerName: "Reading time in minutes",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "totalSentences",
    headerName: "Total Sentence",
    width: 125,
    type: "number",
    editable: false,
  },
  {
    field: "totalWords",
    headerName: "Total words",
    width: 125,
    type: "number",
    editable: false,
  },
  {
    field: "totalChars",
    headerName: "total characters",
    width: 125,
    type: "number",
    editable: false,
  },
  {
    field: "meanWordsPerSentence",
    headerName: "⌀ words per sentence",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "meanCharsPerWord",
    headerName: "⌀ characters per word",
    width: 150,
    type: "number",
    editable: false,
  },
];

export const ArticleComplexityListColumnsOfTypeNumber = ArticleComplexityListColumns.filter(
  (column) => column.type === "number"
) as NumberGridColDef[];
