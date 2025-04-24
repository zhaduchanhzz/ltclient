import { APP_LOCAL_STORAGE_KEY } from "@/consts";
import { useProfileQuery } from "@/services/apis/auth";
import { UserInfo } from "@/services/types/auth";
import LocalStorage from "@/utils/local-storage";
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
  const profileQuery = useProfileQuery();
  const [authState, dispatchAuthState] = useReducer(
    _updateAuthStateReducer,
    initAuthContextState,
  );

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
    const fetchUserProfile = async () => {
      if (!profileQuery) return;

      const accessToken = LocalStorage.get(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);

      if (!accessToken) {
        updateAuthState({
          isInitialized: true,
          isAuthenticated: false,
          userInfo: null,
        });
        return;
      }

      try {
        const response = await profileQuery.refetch();

        if (response.data?.data) {
          updateAuthState({
            isInitialized: true,
            isAuthenticated: true,
            userInfo: response.data.data || null,
          });
        } else {
          updateAuthState({
            isInitialized: true,
            isAuthenticated: false,
            userInfo: null,
          });
        }
      } catch (errors) {
        console.log("errors", errors);
        updateAuthState({
          isInitialized: true,
          isAuthenticated: false,
          userInfo: null,
        });
      }
    };

    fetchUserProfile();
  }, [profileQuery.isFetching]);

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
