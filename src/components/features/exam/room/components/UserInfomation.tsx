import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import WebcamCapture from "@/components/common/WebcamCapture";
import { useAuthContext } from "@/contexts/AuthContext";


type UserInfomationProps = {};

const UserInfomation = (_: UserInfomationProps) => {
  const { userInfo } = useAuthContext();

  if (!userInfo) return null;

  return (
    <BasicBox>
      <BasicStack spacing={2} direction="row" sx={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 8 }}>
        <BasicStack>
          <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
            Vui lòng bật camera và mic để bắt đầu thi
          </BasicTypography>
        </BasicStack>

        <BasicStack spacing={2} direction="row" sx={{ justifyContent: "center", alignItems: "start", display: "flex" }}>
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
                {userInfo.name}
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
                {userInfo.username}
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
                {userInfo.accountType === "FREE" ? "Miễn phí" : "VIP"}
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
                {userInfo.examsTaken}
              </BasicTypography>
            </BasicBox>
          </BasicStack>
        </BasicStack>
      </BasicStack>
    </BasicBox>
  );
};

export default UserInfomation;
