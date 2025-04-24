import ListItemText, { ListItemTextProps } from "@mui/material/ListItemText";

type BasicListItemTextProps = ListItemTextProps & {};

const BasicListItemText = (props: BasicListItemTextProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <ListItemText id={id} data-cy={id} {...otherProps}>
      {children}
    </ListItemText>
  );
};

export default BasicListItemText;
