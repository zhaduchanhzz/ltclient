import {
  UploadFile as UploadFileIcon,
  type SvgIconComponent,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import type { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Dispatch, Fragment, SetStateAction } from "react";
import type { DropzoneOptions, FileRejection } from "react-dropzone";
import { useDropzone } from "react-dropzone";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useNotification from "@/contexts/NotificationContext";
import { FILE_TYPES } from "@/consts";

/**
 * Defines the properties for a component that handles file dropzone functionality.
 *
 * Properties:
 * - `icon` : An optional icon component to be displayed within the dropzone.
 * - `sx` : Custom styling to be applied to the component, adhering to MUI's styling system.
 * - `onDownloadFile` : A callback function invoked when a file download action is triggered.
 * - `setFile` : A state setter function to update the current file state.
 * - `fileInfo` : An object containing information about the file, including its name and URL.
 * - `onRemoveFile` : A callback function invoked when a file removal action is triggered.
 */
type Props = DropzoneOptions & {
  icon?: SvgIconComponent;
  sx?: BoxProps["sx"];
  onDownloadFile: () => void;
  setFile: Dispatch<SetStateAction<File | null>>;
  fileInfo: {
    nameFile: string;
    urlFile: string;
  };
  onRemoveFile: () => void;
};

const FileDropzone = (props: Props) => {
  const {
    accept,
    maxFiles,
    maxSize,
    minSize,
    multiple = false,
    setFile,
    fileInfo,
    onDownloadFile,
    onRemoveFile,
    sx,
  } = props;

  const setNotification = useNotification();

  const onDrop = async ([file]: File[]) => {
    if (file) {
      setFile(file);
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
      {fileInfo.nameFile ? (
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <Typography onClick={onDownloadFile}>{fileInfo.nameFile}</Typography>
          <IconButton onClick={onRemoveFile}>
            <HighlightOffIcon />
          </IconButton>
        </Stack>
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
            <UploadFileIcon fontSize="medium" color="action" />
            <Typography variant="caption" align="center" sx={{ mt: 1 }}>
              {"Chọn hoặc kéo thả tệp để tải file"}
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
  height: 100,
  padding: theme.spacing(2),
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

export default FileDropzone;
