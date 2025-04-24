import TimelineContent, {
  TimelineContentProps,
} from "@mui/lab/TimelineContent";

type BasicTimelineContentProps = TimelineContentProps & {};

const BasicTimelineContent = (props: BasicTimelineContentProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <TimelineContent id={id} data-cy={id} {...otherProps}>
      {children}
    </TimelineContent>
  );
};

export default BasicTimelineContent;
