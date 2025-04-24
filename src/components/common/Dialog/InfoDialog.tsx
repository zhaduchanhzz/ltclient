import BasicDialog from "@/components/base/MaterialUI-Basic/Dialog";
import BasicDialogActions from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogAction";
import BasicDialogContent from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogContent";
import BasicDialogTitle from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogTitle";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import { Button, DialogProps } from "@mui/material";
import { ReactNode } from "react";

/**
 * A reusable confirmation dialog with a single confirm button.
 *
 * Properties:
 * - `open` : Controls whether the dialog is open or closed.
 * - `title` : The title displayed at the top of the dialog.
 * - `description` : A ReactNode content inside the dialog (can be text or JSX).
 * - `onConfirm` : Callback function triggered when the confirm button is clicked.
 * - `onClose` : Callback function triggered when the cancel button is clicked.
 * - `confirmText` : Text displayed on the confirm button (default: "Confirm").
 * 
 * @example 
 *  <InfoDialog
        open={openDialog}
        title="Xác nhận"
        description={<p>Bạn có chắc chắn muốn <strong>nộp bài</strong> không?</p>}
        onConfirm={handleSubmit}
        confirmText="Nộp bài"
      />
 */

type InfoDialogProps = DialogProps & {
  open: boolean;
  title?: string;
  description?: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
};

const InfoDialog = ({
  open,
  title = "Confirm",
  description,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  ...dialogProps
}: InfoDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

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
      {/* Dialog content (accepts ReactNode) */}
      {description && <BasicDialogContent>{description}</BasicDialogContent>}

      {/* Single Confirm button */}
      <BasicDialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          size="small"
          color="info"
        >
          {confirmText}
        </Button>
      </BasicDialogActions>
    </BasicDialog>
  );
};

export default InfoDialog;
