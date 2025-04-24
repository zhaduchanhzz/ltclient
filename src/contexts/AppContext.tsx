"use client";
import { AlertColor } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

/**
 * Defines the structure for the application context.
 *
 * Properties:
 * - `appAlertInfo`: An object containing alert information or `null` if no alert is active.
 *   - `message`: An optional string representing the alert message.
 *   - `severity`: An optional `AlertColor` indicating the severity level of the alert.
 * - `loadingPage`: A boolean indicating whether a page is currently in a loading state.
 */
type AppContextType = {
  appAlertInfo: {
    message?: string;
    severity?: AlertColor;
  } | null;
  loadingPage: boolean;
};

const initAppContextState = {
  appAlertInfo: null,
  loadingPage: false,
};

const AppContext = createContext<AppContextType>(initAppContextState);

AppContext.displayName = "AppContext";

const AppContextHandler = createContext({
  updateAppState: (
    _payload: Partial<AppContextType>,
    _type?: "update" | "reset",
  ) => {
    /**
     * ignore
     */
  },
});

AppContextHandler.displayName = "AppContextHandler";

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [appState, dispatchAppState] = useReducer(
    _updateAppStateReducer,
    initAppContextState,
  );

  const updateAppState = useCallback(
    (payload: Partial<AppContextType>, type?: "update" | "reset") => {
      dispatchAppState({ type: type || "update", payload });
    },
    [],
  );

  const AppContextHandleValue = useMemo(() => {
    return { updateAppState };
  }, [updateAppState]);

  return (
    <AppContext.Provider value={appState}>
      <AppContextHandler.Provider value={AppContextHandleValue}>
        {children}
      </AppContextHandler.Provider>
    </AppContext.Provider>
  );
};

function _updateAppStateReducer(
  state: AppContextType,
  action: {
    type: "update" | "reset";
    payload: Partial<AppContextType>;
  },
) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "reset":
    default:
      return initAppContextState;
  }
}

export const useAppContext = () => {
  return useContext(AppContext);
};

export const useAppContextHandle = () => {
  return useContext(AppContextHandler);
};
