import { FILE_TYPES } from "@/consts";
import useNotification from "@/contexts/NotificationContext";
import type { SvgIconComponent } from "@mui/icons-material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Typography } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Dispatch, SetStateAction, useEffect } from "react";
import type { DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import MultipleImageItem from "./MultipleImageItem";

/**
 * Defines the properties for the component.
 *
 * Properties:
 * - `icon`: An optional icon component to be displayed within the dropzone.
 * - `sx`: Custom styling to be applied to the component, adhering to MUI's styling system.
 * - `title`: An optional title for the dropzone area.
 * - `setImage`: A state setter function to update the current image file state, represented as an array of files.
 * - `setImageUrl`: A state setter function to update the URLs of the current images, represented as an array of strings.
 * - `imageUrl`: An array of strings representing the URLs of images to be displayed or processed.
 * - `onRemoveFile`: A callback function invoked when a file removal action is triggered, accepting the URL of the image to be removed.
 */
type Props = DropzoneOptions & {
  icon?: SvgIconComponent;
  sx?: BoxProps["sx"];
  title?: string;
  setImage: Dispatch<SetStateAction<File[]>>;
  setImageUrl: Dispatch<SetStateAction<string[]>>;
  imageUrl: string[];
  onRemoveFile: (item: string) => () => void;
};

const MultiSelectImageDropzone = (props: Props) => {
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

  const onDrop = async (files: File[]) => {
    const isInvalidSelect = files.some(
      (item) => !FILE_TYPES.includes(item.type),
    );

    if (isInvalidSelect) {
      setNotification({
        message: "File phải có định dạng: ...",
        severity: "error",
      });
      return;
    }

    setImage(files);
    const objectUrl = files.map((item) => URL.createObjectURL(item));
    setImageUrl((prev) => [...prev, ...objectUrl]);
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
      imageUrl.forEach((item) => URL.revokeObjectURL(item || ""));
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        width: 1,
      }}
    >
      {imageUrl.length > 0 &&
        imageUrl?.map((item) => (
          <MultipleImageItem
            key={item}
            item={item}
            onRemoveFile={onRemoveFile}
            sx={sx}
          />
        ))}
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
    </Box>
  );
};

const Wrapper = styled(Box, {
  shouldForwardProp: (prop: string) => !["isDragActive"].includes(prop),
})<{ isDragActive: boolean }>(({ theme, isDragActive }) => ({
  display: "flex",
  border: 3,
  marginLeft: 4,
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

export default MultiSelectImageDropzone;
