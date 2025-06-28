import { APP_COOKIE_KEY } from "@/consts";
import { useProfileQuery } from "@/services/apis/auth";
import { UserInfo } from "@/services/types/auth";
import CookieStorage from "@/utils/cookie-storage";
import { isTokenExpired } from "@/utils/jwt";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type AuthContextType = {
  userInfo: UserInfo | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
};

const initAuthContextState = {
  userInfo: null,
  isInitialized: false,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(initAuthContextState);

AuthContext.displayName = "AuthContext";

const AuthContextHandler = createContext({
  updateAuthState: (
    _payload: Partial<AuthContextType>,
    _type?: "update" | "reset",
  ) => {
    /**
     * ignore
     */
  },
});

AuthContextHandler.displayName = "AuthContextHandler";

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, dispatchAuthState] = useReducer(
    _updateAuthStateReducer,
    initAuthContextState,
  );

  const accessToken = CookieStorage.get(APP_COOKIE_KEY.ACCESS_TOKEN);
  const profileQuery = useProfileQuery(!!accessToken);

  const updateAuthState = useCallback(
    (payload: Partial<AuthContextType>, type?: "update" | "reset") => {
      dispatchAuthState({ type: type || "update", payload });
    },
    [],
  );

  const AuthContextHandleValue = useMemo(() => {
    return { updateAuthState };
  }, [updateAuthState]);

  useEffect(() => {
    if (!accessToken || (accessToken && isTokenExpired(accessToken))) {
      CookieStorage.remove(APP_COOKIE_KEY.ACCESS_TOKEN);
      CookieStorage.remove(APP_COOKIE_KEY.IS_AUTHENTICATED);
      updateAuthState({
        isInitialized: true,
        isAuthenticated: false,
        userInfo: null,
      });
      return;
    }

    if (profileQuery.data?.data) {
      CookieStorage.setBoolean(APP_COOKIE_KEY.IS_AUTHENTICATED, true);
      updateAuthState({
        isInitialized: true,
        isAuthenticated: true,
        userInfo: profileQuery.data.data,
      });
    } else if (profileQuery.isError) {
      console.error("Profile fetch error:", profileQuery.error);
      CookieStorage.remove(APP_COOKIE_KEY.ACCESS_TOKEN);
      CookieStorage.remove(APP_COOKIE_KEY.IS_AUTHENTICATED);
      updateAuthState({
        isInitialized: true,
        isAuthenticated: false,
        userInfo: null,
      });
    }
  }, [accessToken, profileQuery.data, profileQuery.isError, updateAuthState]);

  return (
    <AuthContext.Provider value={authState}>
      <AuthContextHandler.Provider value={AuthContextHandleValue}>
        {children}
      </AuthContextHandler.Provider>
    </AuthContext.Provider>
  );
};

function _updateAuthStateReducer(
  state: AuthContextType,
  action: {
    type: "update" | "reset";
    payload: Partial<AuthContextType>;
  },
) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "reset":
    default:
      return initAuthContextState;
  }
}

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const useAuthContextHandle = () => {
  return useContext(AuthContextHandler);
};
