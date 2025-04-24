import { Typography, useTheme } from "@mui/material";
import { FieldError } from "react-hook-form";

/**
 * Defines the properties for rendering an error message in a form field.
 *
 * Properties:
 * - `error`: An optional `FieldError` object representing the validation error for the field.
 * - `colorText`: A string specifying the text color for the error message.
 */
type ErrorFieldRenderProps = {
  error?: FieldError;
  colorText: string;
};

const ErrorFieldRender = (props: ErrorFieldRenderProps) => {
  const theme = useTheme();
  const { error, colorText = theme.palette.error.main } = props;
  return (
    <Typography
      variant="caption"
      sx={{
        color: colorText,
        visibility: error && error?.message ? "visible" : "hidden",
      }}
    >
      {error ? error?.message?.toString() : "error"}
    </Typography>
  );
};

export default ErrorFieldRender;
