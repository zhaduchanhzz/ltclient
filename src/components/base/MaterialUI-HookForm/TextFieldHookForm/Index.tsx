import { useTheme } from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import { useController, useFormContext } from "react-hook-form";
import ErrorFieldRender from "../ErrorFieldRender";

/**
 * Defines the properties for a text field component integrated with React Hook Form.
 *
 * Properties:
 * - `name`: A string specifying the name of the text field, used for form handling.
 * - Other properties are inherited from `TextFieldProps`, except for `name`, which is required.
 */
type Props = Omit<TextFieldProps, "name"> & {
  name: string;
};

const TextFieldHookForm = (props: Props) => {
  const { name, placeholder, disabled, required, ...rest } = props;
  const theme = useTheme();

  const { register, control } = useFormContext();

  const {
    fieldState: { error },
  } = useController({ name, control });

  return (
    <>
      <TextField
        {...register(name)}
        id={name}
        fullWidth
        error={Boolean(error)}
        required={required}
        placeholder={disabled ? void 0 : placeholder}
        disabled={disabled}
        name={name}
        sx={{
          ".MuiInputBase-root": {
            backgroundColor: disabled ? "#ccc" : theme.palette.background.paper,
          },
        }}
        {...rest}
      />
      {error && (
        <ErrorFieldRender error={error} colorText={theme.palette.error.dark} />
      )}
    </>
  );
};

export default TextFieldHookForm;
