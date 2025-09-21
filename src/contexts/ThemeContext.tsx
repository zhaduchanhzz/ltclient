"use client";
import { createAppTheme } from "@/components/base/theme";
import LocalStorage from "@/utils/local-storage";
import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
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

const THEME_STORAGE_KEY = "theme-mode";

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Mode => {
  // Check if we're on the client side
  if (typeof window === "undefined") {
    return "light";
  }

  // Try to get from localStorage first
  const stored = LocalStorage.get(THEME_STORAGE_KEY);

  if (stored === "dark" || stored === "light") {
    return stored as Mode;
  }

  // Fall back to system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

const initThemeContextState = {
  // Always start as light to match SSR output and avoid hydration mismatch.
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
  toggleTheme: () => {
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
  const [mounted, setMounted] = useState(false);
  const [themeState, dispatchThemeState] = useReducer(
    _updateThemeStateReducer,
    initThemeContextState,
  );

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Get the actual theme from localStorage after mounting
    const storedTheme = getInitialTheme();
    
    if (storedTheme !== themeState.mode) {
      dispatchThemeState({ type: "update", payload: { mode: storedTheme } });
    }
  }, []);

  // Persist theme changes to localStorage and sync DOM for CSS-only consumers
  useEffect(() => {
    if (mounted) {
      LocalStorage.set(THEME_STORAGE_KEY, themeState.mode);

      // Sync a root class and color-scheme for non-MUI CSS and system UI colors
      if (typeof document !== "undefined") {
        const root = document.documentElement;

        if (themeState.mode === "dark") {
          root.classList.add("dark-mode");
          root.style.colorScheme = "dark";
        } else {
          root.classList.remove("dark-mode");
          root.style.colorScheme = "light";
        }
      }
    }
  }, [themeState.mode, mounted]);

  const updateThemeState = useCallback(
    (payload: Partial<ThemeContextType>, type?: "update" | "reset") => {
      dispatchThemeState({ type: type || "update", payload });
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    const newMode = themeState.mode === "light" ? "dark" : "light";
    dispatchThemeState({ type: "update", payload: { mode: newMode } });
  }, [themeState.mode]);

  const ThemeContextHandleValue = useMemo(() => {
    return { updateThemeState, toggleTheme };
  }, [updateThemeState, toggleTheme]);

  // Use the mounted state's theme to prevent hydration issues
  const activeTheme = mounted ? themeState.mode : "light";

  return (
    <ThemeContext.Provider value={themeState}>
      <ThemeContextHandler.Provider value={ThemeContextHandleValue}>
        <ThemeProvider theme={createAppTheme(activeTheme)}>
          {children}
          <CssBaseline enableColorScheme />
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
