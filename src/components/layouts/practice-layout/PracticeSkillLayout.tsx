"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";
import SelectSkill from "./components/SelectSkill";
import SelectTopic from "./components/SelectTopic";
import UserInfomation from "./components/UserInfomation";

type PracticeSkillLayoutProps = { children: ReactNode };

const PracticeSkillLayout = ({ children }: PracticeSkillLayoutProps) => {
  const theme = useTheme();

  return (
    <BasicBox sx={{ width: 1 }}>
      <BasicGrid container spacing={2} direction="row">
        <BasicGrid
          container
          spacing={2}
          size={{ xs: 12, sm_600: 6, lg_1200: 3 }}
          sx={{
            maxHeight: 300,
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: 2,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <SelectSkill />
        </BasicGrid>
        <BasicGrid
          container
          spacing={2}
          size={{ xs: 12, lg_1200: 6 }}
          sx={{
            order: { xs: 3, lg_1200: 2 },
            alignItems: "flex-start",
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: 2,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
          }}
        >
          <SelectTopic />
        </BasicGrid>
        <BasicGrid
          container
          spacing={2}
          size={{ xs: 12, sm_600: 6, lg_1200: 3 }}
          sx={{
            order: { xs: 2, lg_1200: 3 },
            maxHeight: 300,
            backgroundColor: theme.palette.background.paper,
            p: 3,
            borderRadius: 2,
            border:
              "1px solid " + theme.palette.customStyle.borderColor.secondary,
            alignItems: "flex-start",
          }}
        >
          <UserInfomation />
        </BasicGrid>
      </BasicGrid>
      {children}
    </BasicBox>
  );
};

export default PracticeSkillLayout;
