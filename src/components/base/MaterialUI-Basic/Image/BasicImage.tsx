import { ImgHTMLAttributes } from "react";

type BasicImageProps = ImgHTMLAttributes<HTMLImageElement> & {};

const BasicImage = (props: BasicImageProps) => {
  const { id, style, ...otherProps } = props;
  return (
    <img
      id={id}
      data-cy={id}
      alt={otherProps.alt || "image"}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      {...otherProps}
    />
  );
};

export default BasicImage;
