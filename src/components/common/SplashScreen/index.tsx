import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import LinearProgress from "@mui/material/LinearProgress";

const SplashScreen = () => {
  return (
    <BasicBox
      sx={{
        display: "grid",
        placeContent: "center",
        bgcolor: "background.paper",
        inset: 0,
        position: "fixed",
        zIndex: "modal",
      }}
    >
      <BasicBox>
        <BasicTypography
          gutterBottom
          variant="subtitle2"
          align="center"
          sx={{
            color: (theme) =>
              theme.palette.getContrastText(theme.palette.background.paper),
          }}
        >
          App Tử Vi
        </BasicTypography>
        <BasicBox
          sx={{
            width: {
              xs: 250,
              sm: 400,
            },
          }}
        >
          <LinearProgress color="primary" />
        </BasicBox>
      </BasicBox>
    </BasicBox>
  );
};

export default SplashScreen;
