"use client";

import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import UserWritingTable from "./components/UserSpeakingTable";

type UserWritingProps = {};

const UserWriting = (_: UserWritingProps) => {
  return (
    <BasicGrid container spacing={3}>
      <BasicGrid size={{ xs: 12, lg: 8 }} sx={{ order: { xs: 2, lg: 1 } }}>
        <UserWritingTable />
      </BasicGrid>
      <BasicGrid size={{ xs: 12, lg: 4 }} sx={{ order: { xs: 1, lg: 2 } }}>
        <BasicPaper sx={{ p: 3 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <BasicTypography variant="body1">
                Số lượt chấm đang có
              </BasicTypography>
              <BasicTypography variant="h6">0</BasicTypography>
            </BasicStack>
            <BasicDivider />
            <BasicStack
              direction="row"
              spacing={2}
              sx={{ justifyContent: "space-between" }}
            >
              <BasicTypography>Số lượt cần có để đăng ký chấm</BasicTypography>
              <BasicTypography variant="h6">1</BasicTypography>
            </BasicStack>
          </BasicStack>
        </BasicPaper>
      </BasicGrid>
    </BasicGrid>
  );
};

export default UserWriting;
