import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

export interface RangeFilterFieldProps {
  field: string;
  label: string;
  upperBoundary: number;
  lowerBoundary: number;
}

export interface RangeFilterChangedInterface {
  field: string;
  from: number;
  to: number;
}

interface RangeFilterProps {
  fields: RangeFilterFieldProps[];
  onChange: (obj: RangeFilterChangedInterface) => void;
}

function FilterItems(items: RangeFilterFieldProps[]) {
  let menuItems: Array<JSX.Element> = [];
  items.map((item) => {
    menuItems.push(<MenuItem value={item.field}>{item.label}</MenuItem>);
  });
  return menuItems;
}

export default function RangeFilter(props: RangeFilterProps) {
  const [selectValue, setSelectValue] = useState("");
  const [sliderValue, setSliderValue] = useState([0, 100]);
  const [maxSliderValue, setMaxSliderValue] = useState(100);
  const [minSliderValue, setMinSliderValue] = useState(0);
  console.log(sliderValue, "sliderVal");

  useEffect(() => {
    setSliderValue([minSliderValue, maxSliderValue]);
    props.onChange({
      field: selectValue,
      from: minSliderValue,
      to: maxSliderValue,
    });
  }, [maxSliderValue, minSliderValue, selectValue]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <InputLabel>Spalte</InputLabel>
        <Select
          fullWidth
          label="Spalte"
          value={selectValue}
          onChange={(e) => {
            setSelectValue(e.target.value);
            setMaxSliderValue(
              props.fields.find((field) => field.field === e.target.value)
                ?.upperBoundary ?? 100
            );
            setMinSliderValue(
              props.fields.find((field) => field.field === e.target.value)
                ?.lowerBoundary ?? 0
            );
          }}
        >
          {FilterItems(props.fields)}
        </Select>
      </Grid>
      <Grid item xs={12} md={6}>
        <Stack sx={{ height: "100%" }} justifyContent="center">
          <Slider
            min={minSliderValue}
            max={maxSliderValue}
            onChange={(e, value) => {
              setSliderValue(value as number[]);
              props.onChange({
                field: selectValue,
                from: sliderValue[0],
                to: sliderValue[1],
              });
            }}
            value={sliderValue}
            valueLabelDisplay="on"
          />
        </Stack>
      </Grid>
    </Grid>
  );
}
