import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { FieldValues } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import { useTheme } from "@mui/material";
import ErrorFieldRender from "../ErrorFieldRender";

/**
 * Defines a value-label pair with a unique key.
 *
 * @template T - The type of the value.
 *
 * Properties:
 * - `value`: The actual value of type `T`.
 * - `label`: A string representing the label associated with the value.
 * - `key`: A unique number serving as the identifier for the value-label pair.
 */
type Value<T> = {
  value: T;
  label: string;
  key: number;
};

/**
 * Defines the properties for a customizable select component.
 *
 * @template O - The type representing each option in the select component.
 * @template V - The type of the value associated with each option, constrained to `string` or `number`.
 *
 * Properties:
 * - `name`: A string specifying the name of the select field.
 * - `options`: An array of options of type `O` to be displayed in the select dropdown.
 * - `renderLabel`: A function that takes an option of type `O` and returns its label as a string.
 * - `renderValue`: A function that takes an option of type `O` and returns its value of type `V`.
 * - `getOptionDisabled`: An optional function that takes a value of type `V` and returns a boolean indicating whether the option should be disabled.
 * - `onSelect`: An optional callback function invoked when an option is selected, receiving the selected value of type `V` or `null`.
 * - `placeholder`: A string representing the placeholder text displayed when no option is selected.
 */
type Props<O extends FieldValues, V extends string | number> = Omit<
  TextFieldProps,
  "name" | "onSelect"
> & {
  name: string;
  options: O[];
  renderLabel: (option: O) => string;
  renderValue: (option: O) => V;
  getOptionDisabled?: (option: V) => boolean;
  onSelect?: (id: V | null) => Promise<void> | void;
  placeholder: string;
};

const AutocompleteHookForm = <O extends FieldValues, V extends string | number>(
  props: Props<O, V>,
) => {
  const {
    name,
    options,
    renderLabel,
    renderValue,
    getOptionDisabled,
    disabled,
    placeholder,
    onSelect,
    ...rest
  } = props;
  const theme = useTheme();

  const { register, control } = useFormContext();

  const {
    field: { value, onChange, ...others },
    fieldState: { error },
  } = useController({ name, control });

  const entries = options.reduce<Record<string | number, Value<V>>>(
    (acc, option, i) => {
      const value = renderValue(option);
      const label = renderLabel(option);
      acc[value] = { value, label, key: i };
      return acc;
    },
    {},
  );

  return (
    <>
      <Autocomplete
        id={name}
        {...register(name)}
        disabled={disabled}
        {...(disabled && {
          forcePopupIcon: false,
          readOnly: true,
        })}
        options={options.map(renderValue).filter(Boolean)}
        getOptionLabel={(option) => entries[option].label}
        noOptionsText={"Không có lựa chọn"}
        getOptionDisabled={getOptionDisabled}
        renderInput={(params) => (
          <>
            <TextField
              error={Boolean(error)}
              placeholder={disabled ? void 0 : placeholder}
              {...params}
              {...rest}
            />
            {error && (
              <ErrorFieldRender
                error={error}
                colorText={theme.palette.error.dark}
              />
            )}
          </>
        )}
        renderOption={(props, option) => {
          const { value, label, key } = entries[option];
          return (
            <Box component="li" {...props} value={value} key={key}>
              <Typography variant="subtitle2">{label}</Typography>
            </Box>
          );
        }}
        {...others}
        value={value in entries ? value : null}
        onChange={(_event, value) => {
          onChange(value);
          onSelect?.(value);
        }}
      />
    </>
  );
};

export default AutocompleteHookForm;
