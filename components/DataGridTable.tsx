import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../interfaces/ArticleComplexityInterface";
import { ArticleComplexityListColumns } from "./Dashboard/ComplexityHistogram/ArticleComplexityListColumns";
import { RangeFilterChangedInterface } from "./Dashboard/ComplexityHistogram/RangeFilterComponent";

export interface DataGridTablePropsInterface {
  rows: object[];
  columns: GridColDef[];
  isLoading: boolean;
  pageSize: number;
  page: number;
  rowCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleSorting: (sortModel: GridSortModel) => void;
}

export default function DataGridTable(props: DataGridTablePropsInterface) {
  return (
    <DataGrid
      loading={props.isLoading}
      columns={props.columns}
      rows={props.rows ?? []}
      paginationMode="server"
      pagination
      page={props.page}
      onPageSizeChange={props.onPageSizeChange}
      onPageChange={props.onPageChange}
      pageSize={props.pageSize}
      rowCount={props.rowCount}
      sortingMode="server"
      onSortModelChange={props.handleSorting}
    />
  );
}
