import BasicAlert from "@/components/base/MaterialUI-Basic/Alert";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import type { AlertProps } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import type { ReactNode, SyntheticEvent } from "react";
import { createContext, useCallback, useContext, useState } from "react";

/**
 * Defines the structure for application settings related to alerts.
 *
 * Properties:
 * - `message`: A string, `ReactNode`, or `null` representing the alert message.
 * - `severity`: An optional severity level from `AlertProps["severity"]`, indicating the type of alert.
 */
export type Settings = {
  message: string | null | ReactNode;
  severity?: AlertProps["severity"];
};

export const NotificationHandleContext = createContext(
  (_config: {
    message: string | null | ReactNode;
    severity?: AlertProps["severity"];
  }) => {
    /**
     * ignore
     */
  },
);

const initialSettings: Settings = {
  message: null,
};

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const { message, severity = "success" } = settings;

  const handleClose = async (
    _event: SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const setNotification = useCallback((settings: Settings) => {
    setSettings((state) => ({
      ...state,
      ...settings,
    }));
    setOpen(true);
  }, []);

  return (
    <NotificationHandleContext.Provider value={setNotification}>
      {children}
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <BasicAlert
          onClose={handleClose}
          severity={severity}
          action={
            <IconButton color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {message}
        </BasicAlert>
      </Snackbar>
    </NotificationHandleContext.Provider>
  );
};

const useNotification = () => {
  return useContext(NotificationHandleContext);
};

export default useNotification;
