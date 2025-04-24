"use client";
import { useAppContext, useAppContextHandle } from "@/contexts/AppContext";
import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";

type SnackBarAlertProps = {};

const SnackBarAlert = (_: SnackBarAlertProps) => {
  const { appAlertInfo } = useAppContext();
  const { updateAppState } = useAppContextHandle();

  const handleClose = (
    _?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    updateAppState({ appAlertInfo: null });
  };

  return (
    <>
      {appAlertInfo && (
        <Snackbar
          open={!!appAlertInfo}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={appAlertInfo?.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {appAlertInfo?.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default SnackBarAlert;
