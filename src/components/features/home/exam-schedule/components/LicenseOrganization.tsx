"use client";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useTheme } from "@mui/material";
import { licenseOrganizationSample } from "../utils/data";

type LicenseOrganizationProps = {};

const LicenseOrganization = (_: LicenseOrganizationProps) => {
  const theme = useTheme();

  return (
    <BasicGrid container spacing={4}>
      <BasicGrid size={{ xs: 12 }}>
        <BasicTypography variant="h5">
          Danh sách 34 đơn vị được Bộ cấp phép tổ chức thi VSTEP hình thức thi
          trên máy tính
        </BasicTypography>
        <BasicTypography variant="body2">
          Dữ liệu được cập nhật mới nhất vào tháng 03 năm 2025.
        </BasicTypography>
      </BasicGrid>
      <BasicGrid container spacing={4}>
        {licenseOrganizationSample.map(([region, universities], index) => (
          <BasicGrid
            key={region + index}
            container
            size={{ xs: 12 }}
            spacing={4}
          >
            <BasicGrid size={{ xs: 12 }}>
              <BasicTypography
                variant="h6"
                sx={{ textDecoration: "underline" }}
              >
                {region}
              </BasicTypography>
            </BasicGrid>
            <BasicGrid container spacing={2} size={{ xs: 12 }}>
              {universities.map((university, index) => (
                <BasicGrid key={university + index} size={{ xs: 4 }}>
                  <BasicStack spacing={2} direction="row">
                    <TaskAltIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.customStyle.bsBadgeColors.success,
                      }}
                    />
                    <BasicTypography variant="body2" sx={{ fontWeight: 500 }}>
                      {university}
                    </BasicTypography>
                  </BasicStack>
                </BasicGrid>
              ))}
            </BasicGrid>
          </BasicGrid>
        ))}
      </BasicGrid>
    </BasicGrid>
  );
};

export default LicenseOrganization;
