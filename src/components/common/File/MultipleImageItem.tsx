import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { IconButton, Stack, Tooltip, useTheme } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { app_images } from "../../../../public/images";

/**
 * Defines the properties for the MultipleImageItem component.
 *
 * Properties:
 * - `item`: A string representing the image URL to be displayed.
 * - `onRemoveFile`: A callback function invoked when the remove action is triggered for the specified item.
 */
type MultipleImageItemProps = BoxProps & {
  item: string;
  onRemoveFile: (item: string) => () => void;
};

const MultipleImageItem = (props: MultipleImageItemProps) => {
  const { item, sx, onRemoveFile } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...sx,
        p: 1,
        border: 1,
        m: 0.6,
        borderRadius: 1.5,
        borderColor: theme.palette.customStyle.borderColor.primary,
        position: "relative",
        "&:hover": {
          "#image-hover": {
            opacity: 0.3,
            cursor: "pointer",
          },
          "#image-icon": {
            display: "block",
          },
        },
      }}
    >
      <BasicNextImage
        id="image-hover"
        src={item || app_images.luyenThiVstepLogo}
        alt="anh-nhan-vat"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Stack
        id="image-icon"
        sx={{
          position: "absolute",
          top: "40%",
          right: "25%",
          opacity: 1,
          display: "none",
        }}
        spacing={0}
      >
        <Tooltip title="Xem ảnh" placement="top">
          <IconButton onClick={onRemoveFile(item)}>
            <RemoveRedEyeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa ảnh" placement="top">
          <IconButton onClick={onRemoveFile(item)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default MultipleImageItem;
