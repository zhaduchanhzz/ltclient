import { useTheme } from "@mui/material";
import {
  DatePicker,
  DatePickerProps,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import { useController, useFormContext } from "react-hook-form";
import ErrorFieldRender from "../ErrorFieldRender";

/**
 * Defines the properties for a date picker component integrated with React Hook Form.
 *
 * Properties:
 * - `name`: A string specifying the name of the date picker field, used for form handling.
 * - `label`: A string representing the label displayed for the date picker.
 * - Other properties are inherited from `DatePickerProps<Dayjs>`.
 */
type DatePickerHookformProps = DatePickerProps<Dayjs> & {
  name: string;
  label: string;
};

const DatePickerHookform = (props: DatePickerHookformProps) => {
  const { name, label, ...rest } = props;
  const { control } = useFormContext();
  const theme = useTheme();

  const { register } = useFormContext();
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label={label}
          {...register(name)}
          onChange={(date: Dayjs | null) => {
            onChange(date ? date.tz("Asia/Ho_Chi_Minh") : null);
          }}
          disablePast
          format="DD-MM-YYYY"
          value={value ? dayjs(value).tz("Asia/Ho_Chi_Minh") : null}
          {...rest}
        />
      </DemoContainer>
      {error && (
        <ErrorFieldRender error={error} colorText={theme.palette.error.dark} />
      )}
    </LocalizationProvider>
  );
};

export default DatePickerHookform;
