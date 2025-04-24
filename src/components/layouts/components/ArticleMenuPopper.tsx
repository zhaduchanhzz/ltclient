import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicMenuItem from "@/components/base/MaterialUI-Basic/Menu/BasicMenuItem";
import BasicMenuList from "@/components/base/MaterialUI-Basic/Menu/BasicMenuList";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicPopper from "@/components/base/MaterialUI-Basic/Popper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ClickAwayListener, Grow, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  KeyboardEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { articleMenuLinks } from "../utils/data";

type ArticleMenuPopperProps = {};

const ArticleMenuPopper = (_: ArticleMenuPopperProps) => {
  const theme = useTheme();
  const router = useRouter();
  const [openArticleMenu, setOpenArticleMenu] = useState<boolean>(false);
  const prevOpenArticle = useRef(openArticleMenu);
  const anchorArticleMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (prevOpenArticle.current === true && openArticleMenu === false) {
      anchorArticleMenuRef.current!.focus();
    }

    prevOpenArticle.current = openArticleMenu;
  }, [openArticleMenu]);

  const handleToggleArticle = () => {
    setOpenArticleMenu((prevOpen) => !prevOpen);
  };

  const navigateTo = (route: string) => {
    router.push(route);
  };

  const handleCloseArticle = (event: Event | SyntheticEvent) => {
    if (
      anchorArticleMenuRef.current &&
      anchorArticleMenuRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenArticleMenu(false);
  };

  function handleArticleListKeyDown(event: KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenArticleMenu(false);
    } else if (event.key === "Escape") {
      setOpenArticleMenu(false);
    }
  }

  return (
    <BasicBox sx={{ position: "relative" }}>
      <BasicStack
        direction="row"
        onClick={handleToggleArticle}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          ":hover": {
            cursor: "pointer",
          },
        }}
      >
        <BasicTypography
          ref={anchorArticleMenuRef}
          component="span"
          variant="body2"
          sx={{
            fontWeight: "bold",
            ":hover": {
              cursor: "pointer",
              color: theme.palette.customStyle.link.primary,
            },
          }}
        >
          Bài viết
        </BasicTypography>
        <KeyboardArrowDownIcon />
      </BasicStack>
      <BasicPopper
        open={openArticleMenu}
        anchorEl={anchorArticleMenuRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        sx={{ zIndex: theme.zIndex.appBar + 1 }}
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
              <ClickAwayListener onClickAway={handleCloseArticle}>
                <BasicMenuList
                  id="composition-menu"
                  autoFocusItem={openArticleMenu}
                  onKeyDown={handleArticleListKeyDown}
                >
                  {articleMenuLinks.map((item) => (
                    <BasicMenuItem
                      key={item.href}
                      onClick={(event: SyntheticEvent) => {
                        navigateTo(item.href);
                        handleCloseArticle(event);
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
                </BasicMenuList>
              </ClickAwayListener>
            </BasicPaper>
          </Grow>
        )}
      </BasicPopper>
    </BasicBox>
  );
};

export default ArticleMenuPopper;
