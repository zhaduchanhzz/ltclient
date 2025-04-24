import Avatar, { AvatarProps } from "@mui/material/Avatar";

type BasicAvatarProps = AvatarProps & {};

const BasicAvatar = (props: BasicAvatarProps) => {
  const { id, children, ...otherProps } = props;
  return (
    <Avatar id={id} data-cy={id} {...otherProps}>
      {children}
    </Avatar>
  );
};

export default BasicAvatar;
