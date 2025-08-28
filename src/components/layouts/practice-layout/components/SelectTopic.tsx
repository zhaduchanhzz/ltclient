import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { useListExamsByTypeQuery } from "@/services/apis/exam";
import { CircularProgress, Divider } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

type SelectTopicProps = {};

const SelectTopic = (_: SelectTopicProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Fetch all exams
  const { data, isLoading, error } = useListExamsByTypeQuery(true);

  // Determine current exam type based on pathname
  const getCurrentExamType = () => {
    if (pathname.includes(APP_ROUTE.PRACTICE_LISTENING)) return "LISTENING";
    if (pathname.includes(APP_ROUTE.PRACTICE_READING)) return "READING";
    if (pathname.includes(APP_ROUTE.PRACTICE_WRITING)) return "WRITING";
    if (pathname.includes(APP_ROUTE.PRACTICE_SPEAKING)) return "SPEAKING";
    return null;
  };

  // Get filtered exam IDs based on current route
  const filteredExams = useMemo(() => {
    if (!data?.data) return [];

    const currentType = getCurrentExamType();
    const exams: {
      id: number;
      title?: string;
      examType: string;
      isNeedVip?: boolean | null;
    }[] = [];

    data.data.forEach((examTypeData) => {
      // Only include exams that match the current route's exam type
      if (!currentType || examTypeData.examType === currentType) {
        examTypeData.exams.forEach((exam) => {
          exams.push({
            id: exam.id,
            title: exam.title,
            examType: examTypeData.examType,
            isNeedVip: exam.isNeedVip,
          });
        });
      }
    });

    // Sort by ID
    return exams.sort((a, b) => a.id - b.id);
  }, [data, pathname]);

  const navigateQuestionPage = (examId: number) => () => {
    router.push(`/practice/${examId}`);
  };

  return (
    <BasicGrid container size={{ xs: 12 }} spacing={2}>
      <BasicGrid size={{ xs: 12 }}>
        <BasicStack spacing={2}>
          <BasicTypography variant="body1">Chọn mã đề</BasicTypography>
          <Divider variant="fullWidth" />
        </BasicStack>
      </BasicGrid>
      <BasicGrid container spacing={1}>
        {isLoading ? (
          <BasicBox sx={{ width: "100%", textAlign: "center", py: 2 }}>
            <CircularProgress size={24} />
          </BasicBox>
        ) : error ? (
          <BasicBox sx={{ width: "100%", textAlign: "center", py: 2 }}>
            <BasicTypography variant="body2" color="error">
              Failed to load exams
            </BasicTypography>
          </BasicBox>
        ) : filteredExams.length === 0 ? (
          <BasicBox sx={{ width: "100%", textAlign: "center", py: 2 }}>
            <BasicTypography variant="body2" color="text.secondary">
              No exams available
            </BasicTypography>
          </BasicBox>
        ) : (
          filteredExams.map((exam) => (
            <BasicBox key={exam.id} sx={{ display: "inline-block" }}>
              {/* <Tooltip
                title={
                  <div>
                    <div>{exam.title || `Exam ${exam.id}`}</div>
                    <div>Type: {exam.examType}</div>
                    {exam.isNeedVip && <div>VIP Required</div>}
                  </div>
                }
              > */}
              <BasicButton
                sx={{
                  p: 0,
                  minWidth: 50,
                  minHeight: 40,
                  opacity: exam.isNeedVip ? 0.6 : 1,
                  "&:hover": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                  },
                }}
                onClick={navigateQuestionPage(exam.id)}
                variant="outlined"
              >
                {exam.id}
              </BasicButton>
              {/* </Tooltip> */}
            </BasicBox>
          ))
        )}
      </BasicGrid>
    </BasicGrid>
  );
};

export default SelectTopic;
