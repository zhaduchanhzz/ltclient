import { useAppContext } from "@/contexts/AppContext";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingPageOverlay = () => {
  const { loadingPage } = useAppContext();

  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open={loadingPage}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingPageOverlay;
