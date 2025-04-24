import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";

type UserInfomationProps = {};

const UserInfomation = (_: UserInfomationProps) => {
  return (
    <BasicPaper sx={{ p: 3, width: 1, maxWidth: { xs: 1, lg: 350 } }}>
      <BasicStack spacing={2}>
        <BasicTypography variant="h6" align="center">
          Thông tin tài khoản
        </BasicTypography>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Tài khoản</BasicTypography>
          <BasicTypography variant="h6">VSTEP149275</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Họ tên</BasicTypography>
          <BasicTypography variant="h6">Duong Cong Chien</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Loại tài khoản</BasicTypography>
          <BasicTypography variant="h6">Miễn phí</BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicStack
          spacing={2}
          direction="row"
          sx={{ justifyContent: "space-between" }}
        >
          <BasicTypography variant="body1">Lượt chấm hiện có</BasicTypography>
          <BasicTypography variant="h6">0</BasicTypography>
        </BasicStack>
      </BasicStack>
    </BasicPaper>
  );
};

export default UserInfomation;
