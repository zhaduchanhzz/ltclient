import Timeline, { TimelineProps } from "@mui/lab/Timeline";

type BasicTimelineProps = TimelineProps & {};

const BasicTimeline = (props: BasicTimelineProps) => {
  const { id, children, ...otherProps } = props;
  return (
    // @ts-ignore
    <Timeline id={id} data-cy={id} {...otherProps}>
      {children}
    </Timeline>
  );
};

export default BasicTimeline;
