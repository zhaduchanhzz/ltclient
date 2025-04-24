import type { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import type { PaperProps } from "@mui/material/Paper";
import Paper from "@mui/material/Paper";
import type { ElementType, HTMLAttributes, PropsWithChildren } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

/**
 * Defines the properties for a form component integrated with React Hook Form.
 *
 * @template T - The type representing the form values, extending `FieldValues`.
 *
 * Properties:
 * - `form`: The `UseFormReturn<T>` instance managing the form state and validation.
 * - `paper`: An optional boolean indicating whether the form should be wrapped in a Paper component.
 * - `PaperProps`: An optional object specifying additional properties for the Paper component.
 * - `BoxProps`: An optional object specifying additional properties for the Box component.
 * - `onFinish`: An optional callback function invoked when the form is successfully submitted, receiving the form values of type `T`.
 * - `onError`: An optional callback function invoked when validation errors occur, receiving the error object.
 * - `grid`: An optional boolean indicating whether the form layout should use a grid-based structure.
 * - Other properties are inherited from `HTMLAttributes<HTMLFormElement>`.
 */
type Props<T extends FieldValues> = HTMLAttributes<HTMLFormElement> & {
  form: UseFormReturn<T, any>;
  paper?: boolean;
  PaperProps?: Partial<PaperProps>;
  BoxProps?: Partial<BoxProps>;
  onFinish?: (values: T) => Promise<void> | void;
  onError?: (errors: unknown) => Promise<void> | void;
  grid?: boolean;
};

const HookForm = <T extends FieldValues>(
  props: PropsWithChildren<Props<T>>,
) => {
  const {
    children,
    form,
    paper,
    BoxProps = {},
    onFinish,
    onError,
    grid,
    PaperProps = {
      sx: {
        ...(paper && {
          p: 2,
        }),
        ...(grid && {
          p: 2,
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          gap: 2.5,
        }),
      },
    },
    ...rest
  } = props;

  const Component: ElementType = paper ? Paper : Box;

  const handleError = (errors: unknown) => {
    onError?.(errors);
    console.log("errors", errors);
  };

  return (
    <FormProvider {...form}>
      <Component
        noValidate
        component="form"
        onSubmit={onFinish ? form.handleSubmit(onFinish, handleError) : void 0}
        {...PaperProps}
        {...BoxProps}
        {...rest}
      >
        {children}
      </Component>
    </FormProvider>
  );
};

export default HookForm;
