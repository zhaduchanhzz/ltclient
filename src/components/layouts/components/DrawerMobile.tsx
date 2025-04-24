import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDrawer from "@/components/base/MaterialUI-Basic/Drawer";
import BasicList from "@/components/base/MaterialUI-Basic/List";
import BasicListItem from "@/components/base/MaterialUI-Basic/List/BasicListItem";
import BasicListItemText from "@/components/base/MaterialUI-Basic/List/BasicListItemText";
import { ListItemButton } from "@mui/material";
import { navLinks } from "../utils/data";

type DrawerMobileProps = {
  open: boolean;
  toggleDrawer: () => void;
};

const DrawerMobile = (props: DrawerMobileProps) => {
  const { toggleDrawer, open } = props;
  return (
    <BasicDrawer anchor="top" open={open} onClose={toggleDrawer}>
      <BasicBox
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer}
        onKeyDown={toggleDrawer}
      >
        <BasicList>
          {navLinks.map((nav) => (
            <BasicListItem key={nav.name} disablePadding>
              <ListItemButton>
                <BasicListItemText primary={nav.name} />
              </ListItemButton>
            </BasicListItem>
          ))}
        </BasicList>
      </BasicBox>
    </BasicDrawer>
  );
};

export default DrawerMobile;
