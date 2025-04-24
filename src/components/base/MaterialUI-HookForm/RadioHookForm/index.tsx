import FormControl from "@mui/material/FormControl";
import type { FormControlLabelProps } from "@mui/material/FormControlLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Radio from "@mui/material/Radio";
import type { RadioGroupProps } from "@mui/material/RadioGroup";
import RadioGroup from "@mui/material/RadioGroup";
import { useController, useFormContext } from "react-hook-form";

/**
 * Defines an option for a radio group component.
 *
 * Properties:
 * - `value`: A string or number representing the option's value.
 * - `label`: A string representing the display label for the option.
 */
type Option = {
  value: string | number;
  label: string;
};

/**
 * Defines the properties for a radio group component integrated with React Hook Form.
 *
 * Properties:
 * - `name`: A string specifying the name of the radio group field, used for form handling.
 * - `options`: An array of `Option` objects representing the available radio button choices.
 * - `row`: A boolean indicating whether the radio buttons should be displayed in a row layout.
 * - `onSelect`: An optional callback function triggered when an option is selected, receiving the selected value.
 * - Other properties are inherited from `FormControlLabelProps`, except for `control`, `label`, and `onSelect`, which are omitted.
 */
type Props = Omit<FormControlLabelProps, "control" | "label" | "onSelect"> & {
  name: string;
  options: Option[];
  row?: RadioGroupProps["row"];
  onSelect?: (value: string | number) => void;
};

const RadioHookForm = (props: Props) => {
  const { name, options, row, onSelect, ...rest } = props;

  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  return (
    <FormControl error={Boolean(error)}>
      <RadioGroup
        row={row}
        {...field}
        onChange={(event) => {
          field.onChange(event.target.value);
          onSelect?.(event.target.value);
        }}
      >
        {options.map(({ value, label }) => (
          <FormControlLabel
            {...rest}
            key={value}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
      {error?.message && (
        <FormHelperText variant="standard">{error.message}</FormHelperText>
      )}
    </FormControl>
  );
};

export default RadioHookForm;
