import BasicDialog from "@/components/base/MaterialUI-Basic/Dialog";
import BasicDialogContent from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogContent";
import BasicDialogTitle from "@/components/base/MaterialUI-Basic/Dialog/BasicDialogTitle";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import { DialogProps } from "@mui/material";
import { ReactNode } from "react";

/**
 * A simple view-only dialog component that displays a title and content.
 *
 * Properties:
 * - `open` : Controls whether the dialog is open or closed.
 * - `title` : The title displayed at the top of the dialog.
 * - `description` : A ReactNode content inside the dialog (can be text or JSX).
 *
 * @example 
 *  <ViewDialog
        open={openInfoDialog}
        title="Thông tin chi tiết"
        description={<p>Nội dung hiển thị trong dialog này.</p>}
      />
 */

type ViewDialogProps = DialogProps & {
  open: boolean;
  title?: string;
  description?: ReactNode;
};

const ViewDialog = ({
  open,
  title = "Thông báo",
  description,
  ...dialogProps
}: ViewDialogProps) => {
  return (
    <BasicDialog open={open} maxWidth="xs" fullWidth {...dialogProps}>
      {/* Dialog title */}
      <BasicDialogTitle>{title}</BasicDialogTitle>
      <BasicDivider />
      {/* Dialog content (supports ReactNode) */}
      {description && <BasicDialogContent>{description}</BasicDialogContent>}
    </BasicDialog>
  );
};

export default ViewDialog;
