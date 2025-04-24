import React from "react";
import Box from "@mui/material/Box";

type BasicAudioProps = {
  id?: string;
  src: string;
  controls?: boolean;
  className?: string;
};

const BasicAudio: React.FC<BasicAudioProps> = ({
  id,
  src,
  controls = true,
  className,
  ...otherProps
}) => {
  return (
    <Box id={id} data-cy={id} {...otherProps}>
      <audio controls={controls} className={className}>
        <source src={src} type="audio/mp3" />
        Trình duyệt không hỗ trợ audio.
      </audio>
    </Box>
  );
};

export default BasicAudio;
