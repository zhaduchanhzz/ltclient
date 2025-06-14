import BasicCard from "@/components/base/MaterialUI-Basic/Card/Index";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useAuthContext } from "@/contexts/AuthContext";
import dayjs from "dayjs";

type UserInfoCardProps = {};

const UserInfoCard = (_: UserInfoCardProps) => {
  const { userInfo } = useAuthContext();

  if (!userInfo) {
    return null;
  }

  return (
    <BasicCard sx={{ maxWidth: 450, p: 3 }}>
      <BasicGrid container spacing={2}>
        <BasicStack spacing={2} style={{ width: "100%" }}>
          <BasicStack
            direction="row"
            sx={{
              justifyContent: "space-between",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <BasicTypography variant="body1">Tài khoản</BasicTypography>
            <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
              {userInfo.username}
            </BasicTypography>
          </BasicStack>
          <BasicDivider />
        </BasicStack>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2} style={{ width: "100%" }}>
            <BasicStack
              direction="row"
              sx={{
                justifyContent: "space-between",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}
            >
              <BasicTypography variant="body1">Loại tài khoản</BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                {userInfo.accountType === "VIP" ? "VIP" : "Miễn phí"}
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2} style={{ width: "100%" }}>
            <BasicStack
              direction="row"
              sx={{
                justifyContent: "space-between",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}
            >
              <BasicTypography variant="body1">
                Lượt chấm hiện có
              </BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                {userInfo.gradeRequest
                  ? userInfo.gradeRequest
                  : "Chưa thi lần nào"}
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2} style={{ width: "100%" }}>
            <BasicStack
              direction="row"
              sx={{
                justifyContent: "space-between",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                width: "100%",
              }}
            >
              <BasicTypography variant="body1">Ngày tạo</BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                {dayjs(userInfo.createdAt).format("DD-MM-YYYY HH:mm:ss")}
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack
            direction="row"
            sx={{
              justifyContent: "space-between",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <BasicTypography variant="body1">Số lượt đã thi</BasicTypography>
            <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
              {userInfo.examsTaken}
            </BasicTypography>
          </BasicStack>
        </BasicGrid>
        {userInfo.accountType === "VIP" && userInfo.expirationVipDate && (
          <BasicGrid container spacing={2} size={{ xs: 12 }}>
            <BasicStack spacing={2} style={{ width: "100%" }}>
              <BasicStack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  width: "100%",
                }}
              >
                <BasicTypography variant="body1">Hạn VIP</BasicTypography>
                <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                  {dayjs(userInfo.expirationVipDate).format("DD-MM-YYYY")}
                </BasicTypography>
              </BasicStack>
              <BasicDivider />
            </BasicStack>
          </BasicGrid>
        )}
      </BasicGrid>
    </BasicCard>
  );
};

export default UserInfoCard;
