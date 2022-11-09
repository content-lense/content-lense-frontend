import { Box, FormControl, Grid, InputLabel, MenuItem, Select, Slider, Stack } from "@mui/material";
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
  fieldValues: RangeFilterChangedInterface;
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
  const [selectField, setSelectField] = useState("");
  const [sliderValue, setSliderValue] = useState([0, 100]);
  const [maxSliderValue, setMaxSliderValue] = useState(100);
  const [minSliderValue, setMinSliderValue] = useState(0);

  useEffect(()=>{
    const {upperBoundary, lowerBoundary} = getSliderBoundaries(props.fieldValues.field);
    setSelectField(props.fieldValues.field);
    setMaxSliderValue(upperBoundary);
    setMinSliderValue(lowerBoundary);
    setSliderValue([props.fieldValues.from, props.fieldValues.to]);
    props.onChange({
      field: props.fieldValues.field,
      from: props.fieldValues.from,
      to: props.fieldValues.to,
    });
    // console.log("sliderValues", minSliderValue, maxSliderValue, "boundaries", getSliderBoundaries(props.fieldValues.field), "props", props.fieldValues)
  },[props.fieldValues])

  function getSliderBoundaries(field: string){
    console.log("verdreht", props.fields.find((_field) => _field.field === field))
    return props.fields.find((_field) => _field.field === field)??{lowerBoundary:0, upperBoundary:100};
  }


  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <InputLabel></InputLabel>
        <Select
          fullWidth
          label="Bitte Filter wählen"

          value={selectField}
          onChange={(e) => {
            setSelectField(e.target.value);
            const {upperBoundary, lowerBoundary} = getSliderBoundaries(e.target.value);
            setMaxSliderValue(upperBoundary);
            setMinSliderValue(lowerBoundary);
            setSliderValue([lowerBoundary, upperBoundary]);
            props.onChange({
              field: e.target.value,
              from: lowerBoundary,
              to: upperBoundary,
            });
            console.log("onChangeValues", e.target.value, lowerBoundary, upperBoundary)
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
                field: selectField,
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
