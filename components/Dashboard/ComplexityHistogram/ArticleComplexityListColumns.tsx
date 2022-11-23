import { GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../../../interfaces/ArticleComplexityInterface";

export interface NumberGridColDef extends Omit<GridColDef, "field"> {
  field: keyof ArticleComplexityNumberTypes;
}

export interface RestrictedGridColDef extends Omit<GridColDef, "field"> {
  field: keyof ArticleComplexityInterface;
}

export const ArticleComplexityListColumns: RestrictedGridColDef[] = [
  {
    field: "article",
    headerName: "Titel",
    width: 150,
    type: "string",
    editable: false,
    valueGetter: (params) => {
      return params.row.article.title;
    },
  },
  {
    field: "wienerSachtextIndex",
    headerName: "Wiener-Sachtextindex",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "readingTimeInMinutes",
    headerName: "Lesezeit in Minuten",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "totalSentences",
    headerName: "Satzanzahl",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "totalWords",
    headerName: "Wortanzahl",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "totalChars",
    headerName: "Zeichenanzahl",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "meanWordsPerSentence",
    headerName: "⌀ Wörter pro Satz",
    width: 150,
    type: "number",
    editable: false,
  },
  {
    field: "meanCharsPerWord",
    headerName: "⌀ Zeichen pro Wort",
    width: 150,
    type: "number",
    editable: false,
  },
];

export const ArticleComplexityListColumnsOfTypeNumber = ArticleComplexityListColumns.filter(
  (column) => column.type === "number"
) as NumberGridColDef[];
