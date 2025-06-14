import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTabs from "@/components/base/MaterialUI-Basic/Tabs";
import BasicTab from "@/components/base/MaterialUI-Basic/Tabs/BasicTab";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useExamsQuery } from "@/services/apis/exam";
import { useEffect, useState, useMemo } from "react";

type ExamDetail = {
  id: string;
  examType: string;
  description: string;
  isNeedVip: string | boolean; // API returns string "true"/"false" but we handle both
  title: string;
  questions: {
    id: string;
    questionText: string;
    answers: {
      id: string;
      anwserText: string;
      isCorrect: boolean;
    }[];
  }[];
};

const ExamNavigation = () => {
  const { data: examsData } = useExamsQuery(true);
  const [exams, setExams] = useState<ExamDetail[]>([]);
  const [examTypes, setExamTypes] = useState<string[]>([]);

  // Group exams by type and filter non-VIP exams
  const examsByType = useMemo(() => {
    const groupedExams: Record<string, ExamDetail[]> = {};
    exams.forEach((exam) => {
      if (exam.isNeedVip === false || exam.isNeedVip === "false") {
        // Handle both boolean and string
        if (!groupedExams[exam.examType]) {
          groupedExams[exam.examType] = [];
        }

        groupedExams[exam.examType].push(exam);
      }
    });
    return groupedExams;
  }, [exams]);

  useEffect(() => {
    if (examsData?.data) {
      const examList = Array.isArray(examsData.data)
        ? examsData.data
        : [examsData.data];
      setExams(examList as ExamDetail[]);
      setExamTypes(
        examList
          .map((exam: ExamDetail) => exam.examType)
          .filter(
            (type: string, index: number, self: string[]) =>
              self.indexOf(type) === index,
          ),
      );
    }
  }, [examsData]);

  const [selectedTabs, setSelectedTabs] = useState({
    section1: 0,
    section2: 0,
    section3: 0,
  });

  const handleTabChange =
    (section: string) => (_: React.SyntheticEvent, newValue: number) => {
      setSelectedTabs((prev) => ({
        ...prev,
        [section]: newValue,
      }));
    };

  return (
    <BasicStack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "black",
        padding: "24px",
        zIndex: 1000,
      }}
    >
      {examTypes.map((type, index) => (
        <BasicBox key={type}>
          <BasicTypography
            color="white"
            variant="subtitle1"
            sx={{ mb: 1, textAlign: "center" }}
          >
            {type}
          </BasicTypography>
          <BasicTabs
            value={index}
            onChange={handleTabChange(`section${index + 1}`)}
            sx={{ minHeight: "unset" }}
          >
            {examsByType[type]?.map((_, partIndex) => (
              <BasicTab
                key={`${type}-part-${partIndex + 1}`}
                label={`Part ${partIndex + 1}`}
                sx={{
                  color: "white",
                  minHeight: "unset",
                  fontSize: "0.875rem",
                  textTransform: "none",
                }}
              />
            )) || (
              <BasicTab
                label="No free exams"
                sx={{
                  color: "gray",
                  minHeight: "unset",
                  fontSize: "0.875rem",
                  textTransform: "none",
                }}
                disabled
              />
            )}
          </BasicTabs>
        </BasicBox>
      ))}
    </BasicStack>
  );
};

export default ExamNavigation;
