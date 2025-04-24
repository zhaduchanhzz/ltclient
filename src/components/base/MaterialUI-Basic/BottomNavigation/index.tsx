import BottomNavigation, {
  BottomNavigationProps,
} from "@mui/material/BottomNavigation";

type BasicBottomNavigationProps = BottomNavigationProps & {};

const BasicBottomNavigation = (props: BasicBottomNavigationProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <BottomNavigation id={id} data-cy={id} {...otherProps}>
      {children}
    </BottomNavigation>
  );
};

export default BasicBottomNavigation;
