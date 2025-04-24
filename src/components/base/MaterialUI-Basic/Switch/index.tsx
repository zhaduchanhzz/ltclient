import Switch, { SwitchProps } from "@mui/material/Switch";

type BasicSwitchProps = SwitchProps & {};

const BasicSwitch = (props: BasicSwitchProps) => {
  const { id, ...otherProps } = props;
  return <Switch id={id} data-cy={id} {...otherProps} />;
};

export default BasicSwitch;
