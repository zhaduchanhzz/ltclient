import ListItemButton, {
  ListItemButtonProps,
} from "@mui/material/ListItemButton";

type BasicListItemButtonProps = ListItemButtonProps & {};

const BasicListItemButton = (props: BasicListItemButtonProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <ListItemButton id={id} data-cy={id} {...otherProps}>
      {children}
    </ListItemButton>
  );
};

export default BasicListItemButton;
