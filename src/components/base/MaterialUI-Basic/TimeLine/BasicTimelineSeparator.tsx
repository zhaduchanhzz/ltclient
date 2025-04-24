import TimelineSeparator, {
  TimelineSeparatorProps,
} from "@mui/lab/TimelineSeparator";

type BasicTimelineSeparatorProps = TimelineSeparatorProps & {};

const BasicTimelineSeparator = (props: BasicTimelineSeparatorProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TimelineSeparator id={id} data-cy={id} {...otherProps}>
      {children}
    </TimelineSeparator>
  );
};

export default BasicTimelineSeparator;
