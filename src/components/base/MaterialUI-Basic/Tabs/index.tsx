import Tabs, { TabsProps } from "@mui/material/Tabs";

type BasicTabsProps = TabsProps & {};

const BasicTabs = (props: BasicTabsProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Tabs id={id} data-cy={id} {...otherProps}>
      {children}
    </Tabs>
  );
};

export default BasicTabs;
