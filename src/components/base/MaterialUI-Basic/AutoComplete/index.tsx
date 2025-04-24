import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";

type BasicAutocompleteProps<T> = AutocompleteProps<
  T,
  boolean,
  boolean,
  boolean
> & {};

const BasicAutocomplete = <T, >(props: BasicAutocompleteProps<T>) => {
  const { id, ...otherProps } = props;
  return <Autocomplete id={id} data-cy={id} {...otherProps} />;
};

export default BasicAutocomplete;
