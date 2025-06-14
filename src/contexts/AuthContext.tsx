import { APP_LOCAL_STORAGE_KEY } from "@/consts";
import { useProfileQuery } from "@/services/apis/auth";
import { UserInfo } from "@/services/types/auth";
import LocalStorage from "@/utils/local-storage";
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

  const accessToken = LocalStorage.get(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
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
      LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      updateAuthState({
        isInitialized: true,
        isAuthenticated: false,
        userInfo: null,
      });
      return;
    }

    if (profileQuery.data?.data) {
      updateAuthState({
        isInitialized: true,
        isAuthenticated: true,
        userInfo: profileQuery.data.data,
      });
    } else if (profileQuery.isError) {
      console.error("Profile fetch error:", profileQuery.error);
      LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
      updateAuthState({
        isInitialized: true,
        isAuthenticated: false,
        userInfo: null,
      });
    }
  }, [accessToken, profileQuery.data, profileQuery.isError]);

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
