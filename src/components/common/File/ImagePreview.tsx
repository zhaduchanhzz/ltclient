import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import { CDN_IMAGE, FILE_TYPES } from "@/consts";
import useNotification from "@/contexts/NotificationContext";
import { type SvgIconComponent } from "@mui/icons-material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { IconButton, Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Dispatch, Fragment, SetStateAction, useEffect } from "react";
import type { DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import { app_images } from "../../../../public/images";

/**
 * Defines the properties for the component.
 *
 * Properties:
 * - `icon`: An optional icon component to be displayed within the dropzone.
 * - `sx`: Custom styling to be applied to the component, adhering to MUI's styling system.
 * - `title`: An optional title for the dropzone area.
 * - `setImage`: A state setter function to update the current image file state.
 * - `setImageUrl`: A state setter function to update the URL of the current image.
 * - `imageUrl`: An optional URL of the image to be displayed or processed.
 * - `onRemoveFile`: Callback function invoked when a file removal action is triggered.
 */
type Props = DropzoneOptions & {
  icon?: SvgIconComponent;
  sx?: BoxProps["sx"];
  title?: string;
  setImage: Dispatch<SetStateAction<File | null>>;
  setImageUrl: Dispatch<SetStateAction<string>>;
  imageUrl?: string;
  onRemoveFile: () => void;
};

const ImageDropzone = (props: Props) => {
  const {
    accept = { "image/*": [".png", ".jpeg", ".jpg"] },
    maxFiles,
    maxSize,
    minSize,
    multiple = false,
    title,
    setImage,
    setImageUrl,
    imageUrl,
    onRemoveFile,
    sx,
  } = props;

  const setNotification = useNotification();

  const onDrop = async ([file]: File[]) => {
    if (!FILE_TYPES.includes(file.type)) {
      setNotification({
        message: "File phải có định dạng: ...",
        severity: "error",
      });
      return;
    }

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(objectUrl);
    }
  };

  const onDropRejected = (fileRejections: FileRejection[]) => {
    if (!FILE_TYPES.includes(fileRejections[0].file.type)) {
      setNotification({
        message: "File phải có định dạng: ...",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(imageUrl || "");
    };
  }, [imageUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected,
    accept,
    maxFiles,
    maxSize,
    minSize,
    onDrop,
    multiple,
  });

  return (
    <Fragment>
      {imageUrl ? (
        <Box sx={{ ...sx, position: "relative" }}>
          <BasicNextImage
            src={
              imageUrl
                ? imageUrl.startsWith("blob")
                  ? imageUrl
                  : CDN_IMAGE + imageUrl
                : app_images.luyenThiVstepLogo
            }
            alt="image-upload"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <IconButton
            onClick={onRemoveFile}
            sx={{ position: "absolute", top: 0, right: 0 }}
          >
            <HighlightOffIcon />
          </IconButton>
        </Box>
      ) : (
        <Wrapper isDragActive={isDragActive} sx={sx} {...getRootProps()}>
          <input {...getInputProps()} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AddPhotoAlternateIcon fontSize="medium" color="action" />
            <Typography variant="caption" align="center" sx={{ mt: 1 }}>
              {title}
            </Typography>
            {maxFiles && multiple && (
              <Typography variant="caption" color="text.secondary">
                {`Tối đa ${maxFiles} file`}
              </Typography>
            )}
          </Box>
        </Wrapper>
      )}
    </Fragment>
  );
};

const Wrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["isDragActive"].includes(prop),
})<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
  display: "flex",
  flexGrow: 1,
  border: 3,
  borderStyle: "dashed",
  borderColor: theme.palette.divider,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  ...(isDragActive && {
    backgroundColor: theme.palette.action.active,
    opacity: 0.5,
  }),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    cursor: "pointer",
    opacity: 0.5,
  },
}));

export default ImageDropzone;
