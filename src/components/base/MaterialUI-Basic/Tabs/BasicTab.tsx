import Tab, { TabProps } from "@mui/material/Tab";

type BasicTabProps = TabProps & {};

const BasicTab = (props: BasicTabProps) => {
  const { id, ...otherProps } = props;
  return <Tab id={id} data-cy={id} {...otherProps} />;
};

export default BasicTab;
