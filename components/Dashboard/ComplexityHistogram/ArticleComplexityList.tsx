import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridFilterModel, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { filterProps } from "recharts/types/util/types";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";
import { ArticleComplexityListColumns } from "./ArticleComplexityListColumns";
import RangeFilterComponent, {
  RangeFilterChangedInterface,
  RangeFilterFieldProps,
} from "./RangeFilterComponent";

interface ArticleComplexityListPropsInterface {
  articleData: ArticleComplexityInterface[];
  isLoading: boolean;
  onRangeFilterChange: (obj: RangeFilterChangedInterface) => void;
}

export default function ArticleComplexityList(props: ArticleComplexityListPropsInterface) {
  const fieldData = props.articleData
    ? ArticleComplexityListColumns.filter((column) => column.type === "number").map((column) => {
        return {
          field: column.field,
          label: column.headerName ?? column.field,
          upperBoundary: Math.max(
            ...props.articleData.map((article) => article[column.field] as number)
          ),
          lowerBoundary: Math.min(
            ...props.articleData.map((article) => article[column.field] as number)
          ),
        };
      })
    : [];
  console.log(fieldData, "fieldData");
  return (
    <>
      <Box sx={{ height: 400, width: "100%" }}>
        <RangeFilterComponent fields={fieldData} onChange={props.onRangeFilterChange} />
        <DataGrid
          loading={props.isLoading}
          columns={ArticleComplexityListColumns}
          rows={props.articleData ?? []}
        />
      </Box>
    </>
  );
}
