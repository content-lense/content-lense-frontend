import { Box } from "@mui/material";
import { ArticleComplexityNumberTypes } from "../../../interfaces/ArticleComplexityInterface";
import DataGridTable, { DataGridTablePropsInterface } from "../../DataGridTable";
import { ArticleComplexityListColumnsOfTypeNumber } from "./ArticleComplexityListColumns";
import RangeFilterComponent, { RangeFilterChangedInterface } from "./RangeFilterComponent";

interface ArticleComplexityListPropsInterface extends DataGridTablePropsInterface {
  articleComplexityBoundaries: { [key in keyof ArticleComplexityNumberTypes]: [number, number] };
  rangeFilterValues: RangeFilterChangedInterface;
  onRangeFilterChange: (obj: RangeFilterChangedInterface) => void;
}

export default function ArticleComplexityList(props: ArticleComplexityListPropsInterface) {
  const fieldData = props.rows
    ? ArticleComplexityListColumnsOfTypeNumber.map((column) => {
        return {
          field: column.field,
          label: column.headerName ?? column.field,
          upperBoundary: props.articleComplexityBoundaries[column.field][1],
          lowerBoundary: props.articleComplexityBoundaries[column.field][0],
        };
      })
    : [];

  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <RangeFilterComponent
          fields={fieldData}
          onChange={props.onRangeFilterChange}
          fieldValues={props.rangeFilterValues}
        />
        <DataGridTable
          rows={props.rows}
          loading={props.loading}
          pageSize={props.pageSize}
          page={props.page}
          rowCount={props.rowCount}
          onPageChange={props.onPageChange}
          onPageSizeChange={props.onPageSizeChange}
          handleSorting={props.handleSorting}
          columns={props.columns}
        />
      </Box>
    </>
  );
}
