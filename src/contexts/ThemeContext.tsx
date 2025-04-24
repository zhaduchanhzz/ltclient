"use client";
import { createAppTheme } from "@/components/base/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

/**
 * Defines the available theme modes.
 */
export type Mode = "light" | "dark";

/**
 * Defines the structure for the theme context.
 *
 * Properties:
 * - `mode`: A string indicating the current theme mode, either `"light"` or `"dark"`.
 */
type ThemeContextType = {
  mode: Mode;
};

const initThemeContextState = {
  mode: "light" as Mode,
};

const ThemeContext = createContext<ThemeContextType>(initThemeContextState);

ThemeContext.displayName = "ThemeContext";

const ThemeContextHandler = createContext({
  updateThemeState: (
    _payload: Partial<ThemeContextType>,
    _type?: "update" | "reset",
  ) => {
    /**
     * ignore
     */
  },
});

ThemeContextHandler.displayName = "ThemeContextHandler";

export const ThemeContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeState, dispatchThemeState] = useReducer(
    _updateThemeStateReducer,
    initThemeContextState,
  );

  const updateThemeState = useCallback(
    (payload: Partial<ThemeContextType>, type?: "update" | "reset") => {
      dispatchThemeState({ type: type || "update", payload });
    },
    [],
  );

  const ThemeContextHandleValue = useMemo(() => {
    return { updateThemeState };
  }, [updateThemeState]);

  return (
    <ThemeContext.Provider value={themeState}>
      <ThemeContextHandler.Provider value={ThemeContextHandleValue}>
        <ThemeProvider theme={createAppTheme(themeState.mode)}>
          {children}
          <CssBaseline />
        </ThemeProvider>
      </ThemeContextHandler.Provider>
    </ThemeContext.Provider>
  );
};

function _updateThemeStateReducer(
  state: ThemeContextType,
  action: {
    type: "update" | "reset";
    payload: Partial<ThemeContextType>;
  },
) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "reset":
    default:
      return initThemeContextState;
  }
}

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export const useThemeContextHandle = () => {
  return useContext(ThemeContextHandler);
};
