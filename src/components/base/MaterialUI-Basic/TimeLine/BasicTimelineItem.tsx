import TimelineItem, { TimelineItemProps } from "@mui/lab/TimelineItem";

type BasicTimelineItemProps = TimelineItemProps & {};

const BasicTimelineItem = (props: BasicTimelineItemProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TimelineItem id={id} data-cy={id} {...otherProps}>
      {children}
    </TimelineItem>
  );
};

export default BasicTimelineItem;
