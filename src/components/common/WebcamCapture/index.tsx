import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicImage from "@/components/base/MaterialUI-Basic/Image/BasicImage";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture: React.FC = () => {
  const theme = useTheme();
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isCaptured, setIsCaptured] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const videoConstraints = {
    width: 200,
    height: 150,
    facingMode: "user",
  };

  const onCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImageSrc(imageSrc);
      setIsCaptured(true);
    }
  }, [webcamRef]);

  const onShowCaptureAgain = () => {
    setIsCaptured(false);
    setImageSrc(null);
  };

  const handleUserMediaError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <BasicStack spacing={2} alignItems="center">
        <BasicTypography color="error" variant="body2">
          Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập camera của trình duyệt.
        </BasicTypography>
      </BasicStack>
    );
  }

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
          videoConstraints={videoConstraints}
          onUserMediaError={handleUserMediaError}
          style={{ width: 200, height: 150 }}
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
