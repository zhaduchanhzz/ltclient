import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useTheme } from "@mui/material";
import BasicBox from "../../MaterialUI-Basic/Box";
import BasicIconButton from "../../MaterialUI-Basic/IconButton";
import BasicTooltip from "../../MaterialUI-Basic/Tooltip";

/**
 * Defines the properties for a generic component that handles item operations.
 *
 * @template T - The type of the item being managed.
 *
 * Properties:
 * - `item`: The item of type `T` to be managed by the component.
 * - `size`: An optional string indicating the size of the component. Possible values include "small", "medium", "large", or "inherit".
 * - `onEdit`: An optional callback function invoked when the edit action is triggered for the item.
 * - `onDelete`: An optional callback function invoked when the delete action is triggered for the item.
 * - `onViewDetail`: An optional callback function invoked when the view details action is triggered for the item.
 * - `displayEditButton`: An optional boolean indicating whether the edit button should be displayed.
 * - `displayDeleteButton`: An optional boolean indicating whether the delete button should be displayed.
 * - `displayEyeButton`: An optional boolean indicating whether the view details button should be displayed.
 */
type Props<T> = {
  item: T;
  size?: "small" | "medium" | "large" | "inherit";
  onEdit?: (item: T) => () => void;
  onDelete?: (item: T) => () => void;
  onViewDetail?: (item: T) => () => void;
  displayEditButton?: boolean;
  displayDeleteButton?: boolean;
  displayEyeButton?: boolean;
};

const TableToolCustom = <T, >(props: Props<T>) => {
  const {
    item,
    onEdit,
    onDelete,
    onViewDetail,
    displayEditButton = true,
    displayDeleteButton = true,
    displayEyeButton = true,
    size = "small",
  } = props;
  const theme = useTheme();

  return (
    <BasicBox
      sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    >
      {displayEditButton && (
        <BasicTooltip title="Chỉnh sửa" placement="top">
          <BasicIconButton onClick={onEdit?.(item)}>
            <EditIcon
              fontSize={size}
              sx={{ color: theme.palette.customStyle.icon.primary }}
            />
          </BasicIconButton>
        </BasicTooltip>
      )}
      {displayEyeButton && (
        <BasicTooltip title="Xem chi tiết" placement="top">
          <BasicIconButton onClick={onViewDetail?.(item)}>
            <RemoveRedEyeIcon
              fontSize={size}
              sx={{ color: theme.palette.customStyle.icon.primary }}
            />
          </BasicIconButton>
        </BasicTooltip>
      )}
      {displayDeleteButton && (
        <BasicTooltip title="Xóa" placement="top">
          <BasicIconButton onClick={onDelete?.(item)}>
            <DeleteIcon
              fontSize={size}
              sx={{ color: theme.palette.customStyle.icon.primary }}
            />
          </BasicIconButton>
        </BasicTooltip>
      )}
    </BasicBox>
  );
};

export default TableToolCustom;
