import { DateTimePicker } from "@mui/x-date-pickers/";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useTheme } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import ErrorFieldRender from "../ErrorFieldRender";

/**
 * Defines the properties for a date-time picker component integrated with React Hook Form.
 *
 * Properties:
 * - `name`: A string specifying the name of the date-time picker field, used for form handling.
 * - `label`: A string representing the label displayed for the date-time picker.
 */
type DateTimePickerHookformProps = {
  name: string;
  label: string;
};

const DateTimePickerHookform = (props: DateTimePickerHookformProps) => {
  const { name, label } = props;
  const { control } = useFormContext();
  const theme = useTheme();

  const { register } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <DemoContainer components={["DateTimePicker"]}>
      <DateTimePicker
        label={label}
        {...register(name)}
        onChange={(date: Date | null) => {
          onChange(date);
        }}
        format="DD-MM-YYYY"
        value={value || null}
        timezone="Asia/Ho_Chi_Minh"
      />
      {error && (
        <ErrorFieldRender error={error} colorText={theme.palette.error.dark} />
      )}
    </DemoContainer>
  );
};

export default DateTimePickerHookform;
