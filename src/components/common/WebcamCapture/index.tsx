import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicImage from "@/components/base/MaterialUI-Basic/Image/BasicImage";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { useTheme } from "@mui/material";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture: React.FC = () => {
  const theme = useTheme();

  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);

  const onCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
      setIsCaptured(true);
    }
  };

  const onShowCaptureAgain = () => {
    setIsCaptured(false);
  };

  return (
    <BasicStack spacing={2}>
      {isCaptured ? (
        <>
          {imageSrc && (
            <BasicImage
              src={imageSrc}
              alt="Chụp từ webcam"
              style={{ width: 200, height: 150 }}
            />
          )}
        </>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{ width: 200 }}
        />
      )}

      {isCaptured ? (
        <BasicButton
          onClick={onShowCaptureAgain}
          sx={{ bgcolor: theme.palette.customStyle.bsBadgeColors.warning }}
        >
          Chụp lại
        </BasicButton>
      ) : (
        <BasicButton
          onClick={onCapture}
          sx={{ bgcolor: theme.palette.customStyle.bsBadgeColors.success }}
        >
          Chụp ảnh
        </BasicButton>
      )}
    </BasicStack>
  );
};

export default WebcamCapture;
