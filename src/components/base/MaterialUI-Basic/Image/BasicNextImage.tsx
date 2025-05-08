import Image, { ImageProps } from "next/image";

type BasicNextImageProps = ImageProps & {
  alt: string;
};

const BasicNextImage = (props: BasicNextImageProps) => {
  const { alt, id, ...otherProps } = props;
  return <Image alt={alt} id={id} data-cy={id} {...otherProps} />;
};

export default BasicNextImage;
