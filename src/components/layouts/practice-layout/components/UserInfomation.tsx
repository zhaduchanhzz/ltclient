import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { Divider } from "@mui/material";

type UserInfomationProps = {};

const UserInfomation = (_: UserInfomationProps) => {
  return (
    <BasicGrid container size={12} spacing={2}>
      <BasicGrid size={12}>
        <BasicStack spacing={2}>
          <BasicTypography variant="body1">Thông tin tài khoản</BasicTypography>
          <Divider variant="fullWidth" />
        </BasicStack>
      </BasicGrid>
      <BasicGrid container direction="column" spacing={2} size={12}>
        <BasicStack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Tài khoản:</BasicTypography>
          <BasicTypography
            variant="h6"
            align="right"
            sx={{ wordWrap: "break-word" }}
          >
            VSTEP149275
          </BasicTypography>
        </BasicStack>
        <BasicGrid size={12}>
          <Divider variant="fullWidth" />
        </BasicGrid>
        <BasicStack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Loại tài khoản:</BasicTypography>
          <BasicTypography variant="h6" align="right">
            Miễn phí
          </BasicTypography>
        </BasicStack>
        <BasicGrid size={12}>
          <Divider variant="fullWidth" />
        </BasicGrid>
        <BasicStack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Lượt chấm hiện có:</BasicTypography>
          <BasicTypography
            variant="h6"
            align="right"
            sx={{ wordWrap: "break-word" }}
          >
            1
          </BasicTypography>
        </BasicStack>
      </BasicGrid>
    </BasicGrid>
  );
};

export default UserInfomation;
