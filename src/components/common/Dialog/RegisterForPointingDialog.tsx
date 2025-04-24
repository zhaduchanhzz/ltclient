import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import InfoDialog from "@/components/common/Dialog/InfoDialog";

type RegisterForPointingDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const RegisterForPointingDialog = (props: RegisterForPointingDialogProps) => {
  const { open, onConfirm, onClose } = props;

  return (
    <InfoDialog
      onClose={onClose}
      maxWidth="sm"
      open={open}
      title="Xác nhận đăng ký chấm thi"
      description={
        <BasicStack spacing={2}>
          <BasicTypography>
            Bài thi của thí sinh sẽ được chấm thi bởi GV có chứng chỉ chấm thi
            VSTEP, kết quả sẽ được trả qua địa chỉ email sau 1-3 ngày.
          </BasicTypography>
          <BasicStack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <BasicTypography variant="body1">
              Số lượt chấm hiện có
            </BasicTypography>
            <BasicTypography variant="h6">0</BasicTypography>
          </BasicStack>
          <BasicStack
            spacing={2}
            direction="row"
            sx={{ justifyContent: "space-between" }}
          >
            <BasicTypography variant="body1">
              Số lượt chấm cần có để đăng ký chấm
            </BasicTypography>
            <BasicTypography variant="h6">1</BasicTypography>
          </BasicStack>
        </BasicStack>
      }
      onConfirm={onConfirm}
      confirmText="Đăng ký"
    />
  );
};

export default RegisterForPointingDialog;
