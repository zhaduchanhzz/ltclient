import Rating, { RatingProps } from "@mui/material/Rating";

type BasicRatingProps = RatingProps & {};

const BasicRating = (props: BasicRatingProps) => {
  const { id, ...otherProps } = props;
  return <Rating id={id} data-cy={id} {...otherProps} />;
};

export default BasicRating;
