"use client";

import BasicAppBar from "@/components/base/MaterialUI-Basic/AppBar";
import BasicAvatar from "@/components/base/MaterialUI-Basic/Avatar";
import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicToolbar from "@/components/base/MaterialUI-Basic/Toolbar";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { Menu as MenuIcon, Person as PersonIcon } from "@mui/icons-material";

type LecturerHeaderProps = {
  onMenuClick: () => void;
};

const LecturerHeader = ({ onMenuClick }: LecturerHeaderProps) => {
  return (
    <BasicAppBar position="sticky" color="default" elevation={1}>
      <BasicToolbar>
        <BasicIconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </BasicIconButton>
        
        <BasicTypography variant="h6" sx={{ flexGrow: 1 }}>
          Lecturer Dashboard
        </BasicTypography>
        
        <BasicStack direction="row" spacing={2} alignItems="center">
          <BasicTypography variant="body2">Lecturer</BasicTypography>
          <BasicAvatar sx={{ width: 32, height: 32 }}>
            <PersonIcon />
          </BasicAvatar>
        </BasicStack>
      </BasicToolbar>
    </BasicAppBar>
  );
};

export default LecturerHeader;