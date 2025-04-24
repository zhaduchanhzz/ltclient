import Skeleton, { SkeletonProps } from "@mui/material/Skeleton";

type BasicSkeletonProps = SkeletonProps & {};

const BasicSkeleton = (props: BasicSkeletonProps) => {
  const { id, ...otherProps } = props;
  return <Skeleton id={id} data-cy={id} {...otherProps} />;
};

export default BasicSkeleton;
