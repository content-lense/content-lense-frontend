import { Autocomplete, Button, Chip, CircularProgress, SxProps, TextField } from "@mui/material";
import { FC, ReactNode, useEffect, useState } from "react";

export type SelectOptionValue<T> = number | string | T;
export type SelectOption<T> = {
  value: SelectOptionValue<T>;
  label: string;
  disabled?: boolean;
};
type FreeInputProps<T> =
  | { allowFreeInput?: true; validateInputFN: (input: string) => SelectOption<T> }
  | { allowFreeInput?: false; validateInputFN?: never };

/**
 * This component let's users select a multitude of items either from a predefined list or a.
 * See: https://mui.com/material-ui/react-autocomplete/#multiple-values for an idea on how to implement
 */
interface ChipSelectFormFieldProps<T> {
  /**
   * This should be a callback for parent components
   * to be notified about value changes of the _ChipSelectFormField_
   */
  onChange: (selected: SelectOptionValue<T>[]) => void;
  /**
   * Provides the user with default options.
   * This should be used, if there is a fixed amount of options, that are not fetched from an api.
   */
  options?: SelectOption<T>[];
  /**
   * Provides a way to fetch and order options based on an search input.
   * Can be useful, if the suggestion options come from an api.
   * May return either options to display or a promise that provides the options
   * after a fetch request finished
   */
  optionsSuggestFN?: (search: string) => SelectOption<T>[] | Promise<SelectOption<T>[]>;
  /**
   * All currently selected Options.
   * Use this if you want a controlled input
   */
  values?: SelectOption<T>[];
  /**
   * All currently selected Options.
   * Use this if you want an uncontrolled input
   */
  defaultValues?: SelectOption<T>[];
  /**
   * @param allowFreeInput If enabled the user should be able to type a free text in the input field
   * and add it, by pressing enter, to the selected values
   * @param validateInputFN If allowFreeInput is true this function is required,
   * should be called if a user types a free input in the component.
   */
  freeInputProps?: FreeInputProps<T>;
  /**
   * The minimum number of items that need to be selected.
   * If the minimum is not yet reached an error message should be shown
   */
  minSelect?: number;
  /**
   * The maximum number of items that can be selected.
   * If the maximum has been reached all additional options should become disabled
   */
  maxSelect?: number;
  /**
   * True if selected items should be removed from options.
   */
  removeSelectedFromOptions?: boolean;
  /**
   * The maximum number of visible chips.
   * The other cips are hidden with a number
   */
  limitTags?: number;
  /**
   * The label above the Textfield
   */
  textFieldLabel?: string;
  /**
   * The Text inside the Textfield before any value is typed
   */
  textFieldPlaceholder?: string;
  /**
   * If true, the input can't be cleared.
   */
  disableClearable?: boolean;
  /**
   * If true, the Autocomplete component is disabled.
   */
  disableAutoComplete?: boolean;
  /**
   * If true, the input will take up the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * If true, the input will take up the full width of its container.
   */
  getLimitTagsText?: (more: number) => ReactNode;
  /**
   * Text to display when there are no options.
   */
  noOptionsText?: string;
  /**
   * The size of the component.
   */
  size?: "small" | "medium";
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   * See the `sx` page for more details.
   */
  sx?: SxProps;
}

function ChipSelectFormField<T>(props: ChipSelectFormFieldProps<T>) {
  const [values, setValues] = useState(props.defaultValues ?? props.values ?? []);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [maxItemsError, setMaxItemsError] = useState(false);
  const [optionsSuggestions, setOptionsSuggestions] = useState<
    SelectOption<T>[] | Promise<SelectOption<T>[]>
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(props.values ?? []);
  }, [props.values]);

  async function onAsyncChange(str: string) {
    if (props.optionsSuggestFN) {
      setLoading(true);
      setOptionsSuggestions(await props.optionsSuggestFN(str));
      setLoading(false);
    }
  }

  return (
    <>
      <Autocomplete
        multiple
        fullWidth={props.fullWidth}
        disableClearable={props.disableClearable}
        disabled={props.disableAutoComplete}
        limitTags={props.limitTags}
        noOptionsText={props.noOptionsText}
        size={props.size}
        sx={props.sx}
        value={values}
        filterSelectedOptions={props.removeSelectedFromOptions}
        onChange={(event, selectedValues) => {
          if (props.maxSelect && selectedValues.length > props.maxSelect) {
            setMaxItemsError(true);
            setError(false);
          } else if (props.minSelect && selectedValues.length < 2) {
            setError(true);
            setMaxItemsError(false);
            setErrorMsg(`You have to choose at least ${props.minSelect} items.`);
          } else {
            setError(false);
            setMaxItemsError(false);
            setErrorMsg("");
          }
          if (
            !props.maxSelect ||
            (props.maxSelect && selectedValues.length > props.maxSelect) === false
          ) {
            setValues([
              ...selectedValues.map((sv) =>
                typeof sv === "string" && props.freeInputProps?.allowFreeInput
                  ? props.freeInputProps.validateInputFN(sv)
                  : typeof sv !== "string"
                  ? sv
                  : { label: "can never happen", value: "error" }
              ),
            ]);
            props.onChange(selectedValues.map((sv) => (typeof sv !== "string" ? sv.value : sv)));
          }
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" && maxItemsError) {
            setError(true);
            setErrorMsg(`You can only choose at max ${props.maxSelect} items.`);
          }
        }}
        id="tags-standard"
        options={
          props.optionsSuggestFN
            ? (optionsSuggestions as SelectOption<T>[]) ?? []
            : props.options ?? []
        }
        loading={loading}
        getOptionLabel={(option: SelectOption<T> | string) =>
          typeof option !== "string" ? option.label : option
        }
        defaultValue={values}
        freeSolo={props.freeInputProps?.allowFreeInput}
        getOptionDisabled={(option) =>
          typeof option !== "string" ? !!option.disabled || maxItemsError : false
        }
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={typeof option !== "string" ? option.label : option}
              {...getTagProps({ index })}
              disabled={typeof option !== "string" ? option.disabled : false}
            />
          ))
        }
        onOpen={async (e) => {
          // only for first time needed
          await onAsyncChange("");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            variant="outlined"
            label={props.textFieldLabel}
            placeholder={props.textFieldPlaceholder}
            helperText={errorMsg}
            onChange={async (e) => {
              await onAsyncChange(e.target.value);
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
}

export default ChipSelectFormField;
