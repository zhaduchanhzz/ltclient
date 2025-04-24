import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
import { TextField, TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

/**
 * Defines the properties for the BasicDateTimePicker component.
 *
 * Properties:
 * - `textFieldProps`: Optional properties to customize the associated TextField component.
 */
type BasicDateTimePickerProps = Omit<
  DateTimePickerProps<Dayjs>,
  "renderInput"
> & {
  textFieldProps?: TextFieldProps;
};

const BasicDateTimePicker = (props: BasicDateTimePickerProps) => {
  const { textFieldProps, ...otherProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        {...otherProps}
        slots={{
          textField: (params) => <TextField {...params} {...textFieldProps} />,
        }}
      />
    </LocalizationProvider>
  );
};

export default BasicDateTimePicker;
