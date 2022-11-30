import { DataGrid, DataGridProps, GridColDef, GridSortModel } from "@mui/x-data-grid";

export interface DataGridTablePropsInterface extends DataGridProps {
  handleSorting: (sortModel: GridSortModel) => void;
}

export default function DataGridTable(props: DataGridTablePropsInterface) {
  return (
    <DataGrid
      onSortModelChange={props.handleSorting}
      paginationMode="server"
      sortingMode="server"
      pagination={true}
      {...props}
    />
  );
}
