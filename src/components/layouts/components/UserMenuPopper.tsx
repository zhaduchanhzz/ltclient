import BasicMenuItem from "@/components/base/MaterialUI-Basic/Menu/BasicMenuItem";
import BasicMenuList from "@/components/base/MaterialUI-Basic/Menu/BasicMenuList";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicPopper from "@/components/base/MaterialUI-Basic/Popper";
import { APP_ROUTE } from "@/consts/app-route";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import {
  ClickAwayListener,
  Grow,
  IconButton,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, SyntheticEvent, useEffect, useRef, useState } from "react";
import { guestMenuLinks, userMenuLinks } from "../utils/data";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_LOCAL_STORAGE_KEY } from "@/consts";
import { useProfileQuery } from "@/services/apis/auth";
import LocalStorage from "@/utils/local-storage";

type UserMenuPopperProps = {};

const UserMenuPopper = (_: UserMenuPopperProps) => {
  const [openUserMenu, setOpenUserMenu] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState(false);
  const prevOpenUserMenu = useRef(openUserMenu);
  const anchorUserMenuRef = useRef<HTMLButtonElement>(null);
  const profileQuery = useProfileQuery();

  const theme = useTheme();
  const router = useRouter();

  const isAuthenticated = Boolean(
    LocalStorage.get(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN),
  );

  useEffect(() => {
    if (prevOpenUserMenu.current === true && openUserMenu === false) {
      anchorUserMenuRef.current!.focus();
    }

    prevOpenUserMenu.current = openUserMenu;
  }, [openUserMenu]);

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const handleCloseUserMenu = (event: Event | React.SyntheticEvent) => {
    if (
      anchorUserMenuRef.current &&
      anchorUserMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenUserMenu(false);
  };

  const handleToggleUserMenu = () => {
    setOpenUserMenu((prevOpen) => !prevOpen);
  };

  const handleLogout = (event: SyntheticEvent) => {
    handleCloseUserMenu(event);

    LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
    profileQuery.refetch();
    setOpenAlert(true);

    setTimeout(() => {
      router.push(APP_ROUTE.LOGIN);
    }, 1500);
  };

  const handleCloseAlert = (
    event?: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  function handleUserListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenUserMenu(false);
    } else if (event.key === "Escape") {
      setOpenUserMenu(false);
    }
  }

  return (
    <Fragment>
      <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity="info"
          sx={{ width: "100%" }}
        >
          Đăng xuất thành công!
        </Alert>
      </Snackbar>
      <IconButton
        ref={anchorUserMenuRef}
        size="large"
        edge="start"
        onClick={handleToggleUserMenu}
        sx={{ "&:hover": { color: theme.palette.primary.main } }}
      >
        <PersonIcon
          sx={{
            width: 30,
            height: 30,
          }}
        />
      </IconButton>
      <BasicPopper
        open={openUserMenu}
        anchorEl={anchorUserMenuRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        sx={{ zIndex: theme.zIndex.appBar + 1, width: 200 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <BasicPaper>
              <ClickAwayListener onClickAway={handleCloseUserMenu}>
                <BasicMenuList
                  id="composition-menu"
                  autoFocusItem={openUserMenu}
                  onKeyDown={handleUserListKeyDown}
                >
                  {isAuthenticated
                    ? userMenuLinks.map((item) => (
                        <BasicMenuItem
                          key={item.href}
                          onClick={(event: SyntheticEvent) => {
                            navigateTo(item.href);
                            handleCloseUserMenu(event);
                          }}
                          sx={{
                            ":hover": {
                              bgcolor: theme.palette.background.paper,
                              color: theme.palette.customStyle.link.primary,
                            },
                          }}
                        >
                          <BasicTypography variant="body2">
                            {item.name}
                          </BasicTypography>
                        </BasicMenuItem>
                      ))
                    : guestMenuLinks.map((item) => (
                        <BasicMenuItem
                          key={item.href}
                          onClick={(event: SyntheticEvent) => {
                            navigateTo(item.href);
                            handleCloseUserMenu(event);
                          }}
                          sx={{
                            ":hover": {
                              bgcolor: theme.palette.background.paper,
                              color: theme.palette.customStyle.link.primary,
                            },
                          }}
                        >
                          <BasicTypography variant="body2">
                            {item.name}
                          </BasicTypography>
                        </BasicMenuItem>
                      ))}
                  {isAuthenticated && (
                    <BasicMenuItem
                      onClick={handleLogout}
                      sx={{
                        ":hover": {
                          bgcolor: theme.palette.background.paper,
                          color: theme.palette.customStyle.link.primary,
                        },
                      }}
                    >
                      <BasicTypography variant="body2">
                        Đăng xuất
                      </BasicTypography>
                      <LogoutIcon sx={{ fontSize: 18, ml: 1 }} />
                    </BasicMenuItem>
                  )}
                </BasicMenuList>
              </ClickAwayListener>
            </BasicPaper>
          </Grow>
        )}
      </BasicPopper>
    </Fragment>
  );
};

export default UserMenuPopper;
