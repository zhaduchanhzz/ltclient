import BasicCard from "@/components/base/MaterialUI-Basic/Card/Index";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";

type UserInfoCardProps = {};

const UserInfoCard = (_: UserInfoCardProps) => {
  return (
    <BasicCard sx={{ maxWidth: 450, p: 3 }}>
      <BasicGrid container spacing={2}>
        <BasicStack spacing={2}>
          <BasicStack direction="row" sx={{ justifyContent: "space-between" }}>
            <BasicTypography variant="body1">Tài khoản</BasicTypography>
            <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
              VSTEP149275
            </BasicTypography>
          </BasicStack>
          <BasicDivider />
        </BasicStack>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              sx={{ justifyContent: "space-between" }}
              spacing={2}
            >
              <BasicTypography variant="body1">Loại tài khoản</BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                Miễn phí
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              sx={{ justifyContent: "space-between" }}
              spacing={2}
            >
              <BasicTypography variant="body1">
                Lượt chấm hiện có
              </BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                1
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              sx={{ justifyContent: "space-between" }}
              spacing={2}
            >
              <BasicTypography variant="body1">Ngày tạo</BasicTypography>
              <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
                04-03-2025 23:50:33
              </BasicTypography>
            </BasicStack>
            <BasicDivider />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container spacing={2} size={{ xs: 12 }}>
          <BasicStack
            direction="row"
            sx={{ justifyContent: "space-between" }}
            spacing={2}
          >
            <BasicTypography variant="body1">Số lượt đã thi</BasicTypography>
            <BasicTypography variant="body1" sx={{ fontWeight: "bold" }}>
              1111
            </BasicTypography>
          </BasicStack>
        </BasicGrid>
      </BasicGrid>
    </BasicCard>
  );
};

export default UserInfoCard;
