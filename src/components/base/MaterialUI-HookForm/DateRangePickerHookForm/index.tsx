import DateRangeIcon from "@mui/icons-material/DateRange";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

/**
 * Defines the properties for a date range component.
 *
 * Properties:
 * - `fromDateField`: A string representing the name of the starting date field.
 * - `toDateField`: A string representing the name of the ending date field.
 */
type Props = {
  fromDateField: string;
  toDateField: string;
};

const DateRangePickerHookForm = (props: Props) => {
  const { fromDateField, toDateField } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const { control, getValues } = useFormContext();

  const {
    field: { value: fromValue, onChange: fromOnChange },
  } = useController({ name: fromDateField, control });

  const {
    field: { value: toValue, onChange: toOnChange },
  } = useController({ name: toDateField, control });

  const fromDate = getValues(fromDateField);
  const toDate = getValues(toDateField);

  return (
    <>
      <Wrapper ref={ref} focused={focused} onClick={() => setOpen(true)}>
        <InputBase
          name={fromDateField}
          value={fromDate ? dayjs(fromDate).format("DD-MM-YYYY") : ""}
          placeholder="dd/mm/yyyy"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{
            zIndex: 1,
            pointerEvents: "none",
            "& .MuiInputBase-input": { py: "8.5px", pl: 1.75, width: "10.5ch" },
          }}
        />
        <Box sx={{ pr: 0.5 }}>{"-"}</Box>
        <InputBase
          name={toDateField}
          value={toDate ? dayjs(toDate).format("DD-MM-YYYY") : ""}
          placeholder="dd/mm/yyyy"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          sx={{
            zIndex: 1,
            pointerEvents: "none",
            "& .MuiInputBase-input": { py: "8.5px", pl: 0.5, width: "10.5ch" },
          }}
        />
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ mr: 1, zIndex: 1, ml: "auto" }}
        >
          <DateRangeIcon />
        </IconButton>
        <Fieldset focused={focused} />
      </Wrapper>
      <Popover
        open={open}
        anchorEl={ref.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            display: "flex",
            "& button.MuiPickersDay-root": { borderRadius: 1 },
          }}
        >
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            onChange={(date) => fromOnChange(date)}
            value={fromValue || null}
            dayOfWeekFormatter={(day) => `${day}`}
            onAccept={(value) => value && toDate && setOpen(false)}
          />
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            onChange={(date) => toOnChange(date)}
            value={toValue || null}
            shouldDisableDate={(date) =>
              fromValue ? dayjs(date).isBefore(fromValue) : false
            }
            dayOfWeekFormatter={(day) => `${day}`}
            onAccept={(value) => value && fromDate && setOpen(false)}
          />
        </Box>
      </Popover>
    </>
  );
};

const Wrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "focused",
})<{
  focused: boolean;
}>(({ theme, focused }) => ({
  width: "100%",
  display: "inline-flex",
  alignItems: "center",
  borderRadius: 4,
  position: "relative",
  cursor: "pointer",
  ...(!focused && {
    "&:hover": {
      "& fieldset": {
        borderColor: theme.palette.text.primary,
      },
    },
  }),
}));

const Fieldset = styled("fieldset", {
  shouldForwardProp: (prop) => prop !== "focused",
})<{
  focused: boolean;
}>(({ theme, focused }) => ({
  position: "absolute",
  top: -1,
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: theme.spacing(0, 1),
  pointerEvents: "none",
  overflow: "hidden",
  minWidth: "0%",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#7d7d7d",
  borderRadius: "inherit",
  ...(focused && {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  }),
}));

export default DateRangePickerHookForm;
