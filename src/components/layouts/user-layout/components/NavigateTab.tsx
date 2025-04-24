import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { useTheme } from "@mui/material";
import { usePathname } from "next/navigation";

type NavigateTabProps = {};
export const tabData = [
  { key: 1, name: "Thông tin chung", href: APP_ROUTE.USER_GENERAL },
  { key: 2, name: "Lịch sử thi", href: APP_ROUTE.USER_HISTORY },
  { key: 3, name: "Danh sách bài viết", href: APP_ROUTE.USER_WRITING },
  { key: 4, name: "Danh sách bài nói", href: APP_ROUTE.USER_SPEAKING },
];

const NavigateTab = (_: NavigateTabProps) => {
  const theme = useTheme();
  const pathname = usePathname();

  return (
    <BasicBox sx={{ mb: 3 }}>
      <BasicStack direction="row" spacing={5}>
        {tabData.map((item) => (
          <BasicNextLink key={item.key} href={item.href}>
            <BasicTypography
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: pathname.includes(item.href)
                  ? theme.palette.info.main
                  : theme.palette.text.primary,
              }}
            >
              {item.name}
            </BasicTypography>
            {pathname.includes(item.href) && (
              <BasicDivider
                sx={{
                  pt: 2,
                  borderBottomWidth: 2,
                  borderColor: theme.palette.info.main,
                }}
              />
            )}
          </BasicNextLink>
        ))}
      </BasicStack>
      <BasicDivider />
    </BasicBox>
  );
};

export default NavigateTab;
