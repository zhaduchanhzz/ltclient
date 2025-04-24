import { TextFieldProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";

/**
 * Defines the properties for the BasicDatePicker component.
 *
 * Properties:
 * - `textFieldProps`: Optional properties to customize the associated TextField component.
 */
type BasicDatePickerProps = Omit<DatePickerProps<Dayjs>, "renderInput"> & {
  textFieldProps?: TextFieldProps;
};

const BasicDatePicker = (props: BasicDatePickerProps) => {
  const { textFieldProps, ...otherProps } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...otherProps}
        slotProps={{ textField: { ...textFieldProps } }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
