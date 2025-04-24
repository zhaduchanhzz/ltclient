import {
  examSections,
  examTab,
} from "@/components/layouts/exam-layout/utils/data";
import { ExamSectionType } from "@/components/layouts/exam-layout/utils/types";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

type ExamContextType = {
  currentTab: string;
  currentSection: ExamSectionType;
  completedSections: {
    listening: boolean;
    reading: boolean;
    writing: boolean;
    speaking: boolean;
  };
};

const initExamContextState = {
  currentTab: examTab.LISTENING.PART_1,
  currentSection: examSections[0],
  completedSections: {
    listening: false,
    reading: false,
    writing: false,
    speaking: false,
  },
};

const ExamContext = createContext<ExamContextType>(initExamContextState);

ExamContext.displayName = "ExamContext";

const ExamContextHandler = createContext({
  updateExamContextState: (
    _payload: Partial<ExamContextType>,
    _type?: "update" | "reset",
  ) => {
    /**
     * ignore
     */
  },
});

ExamContextHandler.displayName = "ExamContextHandler";

export const ExamContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [exampleState, dispatchExampleState] = useReducer(
    _updateExampleStateReducer,
    initExamContextState,
  );

  const updateExamContextState = useCallback(
    (payload: Partial<ExamContextType>, type?: "update" | "reset") => {
      dispatchExampleState({ type: type || "update", payload });
    },
    [],
  );

  const examContextHandleValue = useMemo(() => {
    return { updateExamContextState };
  }, [updateExamContextState]);

  return (
    <ExamContext.Provider value={exampleState}>
      <ExamContextHandler.Provider value={examContextHandleValue}>
        {children}
      </ExamContextHandler.Provider>
    </ExamContext.Provider>
  );
};

function _updateExampleStateReducer(
  state: ExamContextType,
  action: {
    type: "update" | "reset";
    payload: Partial<ExamContextType>;
  },
) {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    case "reset":
    default:
      return initExamContextState;
  }
}

export const useExamContext = () => {
  return useContext(ExamContext);
};

export const useExamContextHandle = () => {
  return useContext(ExamContextHandler);
};
