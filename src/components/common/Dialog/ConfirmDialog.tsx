import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicDialog from "@/components/base/MaterialUI-Basic/Dialog";
import BasicDialogActions from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogAction";
import BasicDialogContent from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogContent";
import BasicDialogTitle from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogTitle";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import { DialogProps } from "@mui/material";
import { ReactNode } from "react";

/**
 * A reusable confirmation dialog with customizable content.
 *
 * Properties:
 * - `open` : Controls whether the dialog is open or closed.
 * - `title` : The title displayed at the top of the dialog.
 * - `description` : A ReactNode content inside the dialog (can be text or JSX).
 * - `onConfirm` : Callback function triggered when the confirm button is clicked.
 * - `onClose` : Callback function triggered when the cancel button is clicked.
 * - `confirmText` : Text displayed on the confirm button (default: "Confirm").
 * - `cancelText` : Text displayed on the cancel button (default: "Cancel").
 *
 * @example 
 *  <ConfirmDialog
        open={openNextDialog}
        title="Chuyển sang phần thi tiếp theo"
        description={<p>Bạn có chắc chắn muốn chuyển sang phần thi <strong>tiếp theo</strong> không?</p>}
        onConfirm={handleConfirmNext}
        onClose={() => setOpenNextDialog(false)}
        confirmText="Sang phần tiếp"
        cancelText="Không"
      />
 */

type ConfirmDialogProps = DialogProps & {
  open: boolean;
  title?: string;
  description?: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmDialog = ({
  open,
  title = "Confirm",
  description,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  ...dialogProps
}: ConfirmDialogProps) => {
  return (
    <BasicDialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      {...dialogProps}
    >
      {/* Dialog title */}
      <BasicDialogTitle>{title}</BasicDialogTitle>
      <BasicDivider />
      {/* Dialog content (supports ReactNode) */}
      {description && <BasicDialogContent>{description}</BasicDialogContent>}

      {/* Action buttons: Cancel & Confirm */}
      <BasicDialogActions>
        <BasicButton
          variant="outlined"
          size="small"
          onClick={onClose}
          color="error"
        >
          {cancelText}
        </BasicButton>
        <BasicButton
          variant="contained"
          size="small"
          onClick={onConfirm}
          color="success"
        >
          {confirmText}
        </BasicButton>
      </BasicDialogActions>
    </BasicDialog>
  );
};

export default ConfirmDialog;
