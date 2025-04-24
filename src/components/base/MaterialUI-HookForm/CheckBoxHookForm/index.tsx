import { Checkbox, CheckboxProps, useTheme } from "@mui/material";
import { useController, useFormContext } from "react-hook-form";
import ErrorFieldRender from "../ErrorFieldRender";

/**
 * Defines the properties for a checkbox component integrated with React Hook Form.
 *
 * Properties:
 * - `name`: A string specifying the name of the checkbox field, used for form handling.
 * - Other properties are inherited from `CheckboxProps`, except for `name`, which is required.
 */
type CheckBoxHookFormProps = Omit<CheckboxProps, "name"> & {
  name: string;
};

const CheckBoxHookForm = (props: CheckBoxHookFormProps) => {
  const { name, ...rest } = props;
  const theme = useTheme();
  const { register, control } = useFormContext();
  const {
    field: { value },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <>
      <Checkbox {...register(name)} {...rest} checked={value} />
      <ErrorFieldRender error={error} colorText={theme.palette.error.dark} />
    </>
  );
};

export default CheckBoxHookForm;
