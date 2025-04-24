import TimelineDot, { TimelineDotProps } from "@mui/lab/TimelineDot";

type BasicTimelineProps = TimelineDotProps & {};

const BasicTimeline = (props: BasicTimelineProps) => {
  const { id, ...otherProps } = props;
  return <TimelineDot id={id} data-cy={id} {...otherProps} />;
};

export default BasicTimeline;
