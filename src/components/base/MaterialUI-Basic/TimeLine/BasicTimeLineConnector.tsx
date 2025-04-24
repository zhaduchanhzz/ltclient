import TimelineConnector, {
  TimelineConnectorProps,
} from "@mui/lab/TimelineConnector";

type BasicTimelineProps = TimelineConnectorProps & {};

const BasicTimeline = (props: BasicTimelineProps) => {
  const { id, ...otherProps } = props;
  return <TimelineConnector id={id} data-cy={id} {...otherProps} />;
};

export default BasicTimeline;
