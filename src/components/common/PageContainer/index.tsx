import { Box, Paper } from "@mui/material";
import { FC, PropsWithChildren } from "react";
import BreadCrumbCustom from "./BreadCrumbs";

interface PageContainerProps {}

const PageContainer: FC<PropsWithChildren<PageContainerProps>> = (props) => {
  const { children } = props;
  return (
    <Box sx={{ width: 1 }}>
      <BreadCrumbCustom />
      <Paper
        elevation={12}
        sx={{
          backgroundColor: "background.paper",
          p: 2,
          mx: 2,
          minHeight: "calc(100vh - 130px)",
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default PageContainer;
