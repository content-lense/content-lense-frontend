import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { filterProps } from "recharts/types/util/types";
import { GenericGetItems } from "../../../data/ReactQueries";
import {
  ArticleComplexityInterface,
  ArticleComplexityNumberTypes,
} from "../../../interfaces/ArticleComplexityInterface";
import {
  ArticleComplexityListColumns,
  ArticleComplexityListColumnsOfTypeNumber,
  RestrictedGridColDef,
} from "./ArticleComplexityListColumns";
import RangeFilterComponent, {
  RangeFilterChangedInterface,
  RangeFilterFieldProps,
} from "./RangeFilterComponent";

interface ArticleComplexityListPropsInterface {
  articleData: ArticleComplexityInterface[];
  articleComplexityBoundaries: { [key in keyof ArticleComplexityNumberTypes]: [number, number] };
  isLoading: boolean;
  rangeFilterValues: RangeFilterChangedInterface;
  onRangeFilterChange: (obj: RangeFilterChangedInterface) => void;
}

export default function ArticleComplexityList(props: ArticleComplexityListPropsInterface) {
  const fieldData = props.articleData
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
        <DataGrid
          loading={props.isLoading}
          columns={ArticleComplexityListColumns}
          rows={props.articleData ?? []}
        />
      </Box>
    </>
  );
}
