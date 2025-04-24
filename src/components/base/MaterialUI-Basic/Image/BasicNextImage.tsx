import Image, { ImageProps } from "next/image";

type BasicNextImageProps = ImageProps & {};

const BasicNextImage = (props: BasicNextImageProps) => {
  const { id, ...otherProps } = props;
  return <Image id={id} data-cy={id} {...otherProps} />;
};

export default BasicNextImage;
