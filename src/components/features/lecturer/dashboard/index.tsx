"use client";

import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import {
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import { useGetDashboardStatsQuery } from "@/services/apis/lecturer";
import LoadingOverlay from "@/components/common/Overlay/LoadingOverlay";

const LecturerDashboard = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  const statCards = [
    {
      title: "Graded",
      value: stats?.graded || 0,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: "success.main",
      bgColor: "success.lighter",
    },
    {
      title: "In Grading",
      value: stats?.inGrading || 0,
      icon: <PendingActionsIcon sx={{ fontSize: 40 }} />,
      color: "warning.main",
      bgColor: "warning.lighter",
    },
    {
      title: "Ungraded",
      value: stats?.ungraded || 0,
      icon: <RadioButtonUncheckedIcon sx={{ fontSize: 40 }} />,
      color: "error.main",
      bgColor: "error.lighter",
    },
  ];

  return (
    <BasicStack spacing={3}>
      <BasicTypography variant="h4">Dashboard Overview</BasicTypography>

      <BasicGrid container spacing={3}>
        {statCards.map((card, index) => (
          <BasicGrid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <BasicPaper
              sx={{
                p: 3,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  bgcolor: card.color,
                },
              }}
            >
              <LoadingOverlay visible={isLoading} />
              <BasicStack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <BasicStack spacing={1}>
                  <BasicTypography
                    variant="body2"
                    color="text.primary"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontWeight: "bold",
                    }}
                  >
                    {card.title}
                  </BasicTypography>
                  <BasicTypography variant="h3" sx={{ fontWeight: "bold" }}>
                    {card.value}
                  </BasicTypography>
                </BasicStack>
                <BasicBox
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: card.bgColor,
                    color: card.color,
                  }}
                >
                  {card.icon}
                </BasicBox>
              </BasicStack>
            </BasicPaper>
          </BasicGrid>
        ))}
      </BasicGrid>

      <BasicPaper sx={{ p: 3, mt: 2 }}>
        <BasicTypography variant="h6" sx={{ mb: 2 }}>
          Summary Statistics
        </BasicTypography>
        <BasicGrid container spacing={2}>
          <BasicGrid size={{ xs: 12, sm: 6 }}>
            <BasicStack spacing={1}>
              <BasicTypography variant="body2" color="text.primary">
                Total Responses
              </BasicTypography>
              <BasicTypography variant="h5">
                {stats?.totalResponses || 0}
              </BasicTypography>
            </BasicStack>
          </BasicGrid>
          <BasicGrid size={{ xs: 12, sm: 6 }}>
            <BasicStack spacing={1}>
              <BasicTypography variant="body2" color="text.primary">
                Completion Rate
              </BasicTypography>
              <BasicTypography variant="h5">
                {stats?.totalResponses
                  ? Math.round((stats.graded / stats.totalResponses) * 100)
                  : 0}
                %
              </BasicTypography>
            </BasicStack>
          </BasicGrid>
        </BasicGrid>
      </BasicPaper>
    </BasicStack>
  );
};

export default LecturerDashboard;
