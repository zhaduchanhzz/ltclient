import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import WebcamCapture from "@/components/common/WebcamCapture";

type UserInfomationProps = {};

const UserInfomation = (_: UserInfomationProps) => {
  return (
    <BasicBox>
      <BasicStack spacing={2} direction="row" sx={{ justifyContent: "center" }}>
        <WebcamCapture />
        <BasicStack>
          <BasicBox>
            <BasicTypography component="span" variant="body2">
              Họ tên:
            </BasicTypography>
            <BasicTypography
              component="span"
              variant="body2"
              sx={{ fontWeight: "bold" }}
            >
              {" "}
              Dương Công Chiến
            </BasicTypography>
          </BasicBox>
          <BasicBox>
            <BasicTypography component="span" variant="body2">
              Tài khoản:
            </BasicTypography>
            <BasicTypography
              component="span"
              variant="body2"
              sx={{ fontWeight: "bold" }}
            >
              {" "}
              VSTEP123456
            </BasicTypography>
          </BasicBox>
          <BasicBox>
            <BasicTypography component="span" variant="body2">
              Loại tài khoản:
            </BasicTypography>
            <BasicTypography
              component="span"
              variant="body2"
              sx={{ fontWeight: "bold" }}
            >
              {" "}
              Miễn phí
            </BasicTypography>
          </BasicBox>
          <BasicBox>
            <BasicTypography component="span" variant="body2">
              Mã lượt thi:
            </BasicTypography>
            <BasicTypography
              component="span"
              variant="body2"
              sx={{ fontWeight: "bold" }}
            >
              {" "}
              222222
            </BasicTypography>
          </BasicBox>
        </BasicStack>
      </BasicStack>
    </BasicBox>
  );
};

export default UserInfomation;
