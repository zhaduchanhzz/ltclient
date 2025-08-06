import BasicAppBar from "@/components/base/MaterialUI-Basic/AppBar";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicToolbar from "@/components/base/MaterialUI-Basic/Toolbar";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import DarkNightChange from "@/components/common/DarkNightChange";
import { APP_ROUTE } from "@/consts/app-route";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, useTheme } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { navLinks } from "../utils/data";
import ArticleMenuPopper from "./ArticleMenuPopper";
import DrawerMobile from "./DrawerMobile";
import UserMenuPopper from "./UserMenuPopper";
import CookieStorage from "@/utils/cookie-storage";
import { APP_LOCAL_STORAGE_KEY } from "@/consts";
import { useGetSettingsQuery } from "@/services/apis/settings";
import { SettingsType } from "@/services/types/settings";
import Image from "next/image";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const theme = useTheme();
  const pathname = usePathname();
  const { push } = useRouter();
  const { data: settings } = useGetSettingsQuery();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <BasicBox
      sx={{
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <BasicAppBar
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <BasicToolbar
          sx={{ height: 68, maxWidth: 1200, width: 1, margin: "0 auto" }}
          disableGutters
        >
          <BasicStack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <BasicStack
              spacing={1}
              direction="row"
              onClick={() => push(APP_ROUTE.HOME)}
              sx={{ cursor: "pointer", alignItems: "center" }}
            >
              {settings?.[SettingsType.LOGO]?.[0]?.content ? (
                <Image
                  src={settings[SettingsType.LOGO][0].content}
                  alt="Logo"
                  width={40}
                  height={40}
                  style={{ objectFit: "contain" }}
                />
              ) : (
                <HomeIcon style={{ color: theme.palette.text.primary }} />
              )}
              <BasicTypography
                variant="h6"
                component="span"
                sx={{ color: theme.palette.text.primary }}
              >
                LUYỆN THI VSTEP
              </BasicTypography>
            </BasicStack>
            <BasicStack
              direction="row"
              spacing={2}
              sx={{
                display: { xs: "none", md: "flex" },
              }}
            >
              {navLinks.map((nav) => {
                return (
                  <BasicBox key={nav.name} sx={{ position: "relative" }}>
                    <BasicTypography
                      variant="body2"
                      component="span"
                      onClick={() => {
                        if (
                          nav.href === APP_ROUTE.EXAM_ROOM &&
                          !CookieStorage.get(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN)
                        ) {
                          push(APP_ROUTE.LOGIN);
                        } else {
                          push(nav.href);
                        }
                      }}
                      sx={{
                        fontWeight: "bold",
                        color: pathname.includes(nav.href)
                          ? theme.palette.customStyle.link.primary
                          : theme.palette.text.primary,
                        ":hover": {
                          cursor: "pointer",
                          color: theme.palette.customStyle.link.primary,
                        },
                      }}
                    >
                      {nav.name}
                    </BasicTypography>
                    {pathname.includes(nav.href) && (
                      <Divider
                        variant="fullWidth"
                        sx={{
                          position: "relative",
                          top: 21,
                          borderWidth: 1,
                          borderColor: theme.palette.customStyle.link.primary,
                        }}
                      />
                    )}
                  </BasicBox>
                );
              })}
              <ArticleMenuPopper />
            </BasicStack>
            <BasicStack
              direction="row"
              spacing={1}
              sx={{ justifyContent: "center", alignItems: "center" }}
            >
              <DarkNightChange />
              <UserMenuPopper />
            </BasicStack>
          </BasicStack>
          <BasicIconButton
            size="large"
            edge="start"
            sx={{
              ml: 2,
              display: { md: "none" },
              "&:hover": { color: theme.palette.primary.main },
              borderRadius: 1,
            }}
            onClick={toggleDrawer}
          >
            <MenuIcon
              sx={{
                width: 30,
                height: 30,
              }}
            />
          </BasicIconButton>
        </BasicToolbar>
      </BasicAppBar>
      <DrawerMobile open={drawerOpen} toggleDrawer={toggleDrawer} />
    </BasicBox>
  );
};

export default Header;
