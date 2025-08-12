import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTableBody from "@/components/base/MaterialUI-Basic/Table/BasicTableBody";
import BasicTableContainer from "@/components/base/MaterialUI-Basic/Table/BasicTableContainer";
import BasicTableHead from "@/components/base/MaterialUI-Basic/Table/BasicTableHead";
import BasicTableRow from "@/components/base/MaterialUI-Basic/Table/BasicTableRow";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import TableCustom from "@/components/base/MaterialUI-Table/Table";
import TableCellCustom from "@/components/base/MaterialUI-Table/TableCell";
import TablePaginationCustom from "@/components/base/MaterialUI-Table/TablePagination";
import RegisterForPointingDialog from "@/components/common/Dialog/RegisterForPointingDialog";
import LoadingOverlay from "@/components/common/Overlay/LoadingOverlay";
import NoDataOverlay from "@/components/common/Overlay/NoDataOverlay";
import { useGetUserHistoryQuery } from "@/services/apis/exam";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useEffect, useMemo, useState } from "react";
import useUserSpeakingFilter from "../hooks/useUserSpeakingFilter";
import { getUserSpeakingTableColumns } from "../utils/columns";

type UserSpeakingTableProps = {};

const UserSpeakingTable = (_: UserSpeakingTableProps) => {
  const columns = useMemo(() => getUserSpeakingTableColumns(), []);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openRegisterForSpeakingPoint, setOpenRegisterForSpeakingPoint] =
    useState<boolean>(false);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [speakingExams, setSpeakingExams] = useState<any[]>([]);

  const { onPageChange, onPageSizeChange, filter } = useUserSpeakingFilter();

  const { data: historyData, isLoading } = useGetUserHistoryQuery(true);

  useEffect(() => {
    if (historyData?.data?.terms) {
      // Use a Map to track unique exams by examId
      const examMap = new Map<number, any>();

      historyData.data.terms.forEach((term: any) => {
        term.exams.forEach((exam: any) => {
          if (exam.examType === "SPEAKING") {
            const existingExam = examMap.get(exam.examId);
            const newExamData = {
              termId: term.termId,
              examCode: term.termId,
              examId: exam.examId,
              title: exam.title,
              responses: exam.responses || [],
              examScore: exam.examScore,
              createdAt: term.createdAt,
            };

            // If exam doesn't exist or the new one has more responses, use it
            if (
              !existingExam ||
              newExamData.responses.length > existingExam.responses.length ||
              (newExamData.responses.length === existingExam.responses.length &&
                newExamData.termId > existingExam.termId)
            ) {
              examMap.set(exam.examId, newExamData);
            }
          }
        });
      });

      // Convert Map to array
      const speakingData = Array.from(examMap.values());
      setSpeakingExams(speakingData);
      setTotalItems(speakingData.length);
    }
  }, [historyData]);

  const onConfirmRegisterForSpeakingPoint = () => {
    setOpenRegisterForSpeakingPoint(false);
  };

  const handleRegisterClick = (termId: number, examId: number) => {
    setSelectedTermId(termId);
    setSelectedExamId(examId);
    setOpenRegisterForSpeakingPoint(true);
  };

  return (
    <BasicPaper sx={{ p: 3 }}>
      <BasicStack spacing={2}>
        <BasicTableContainer id="user-history_table" sx={{ minHeight: 430 }}>
          <LoadingOverlay visible={isLoading} />
          <NoDataOverlay visible={!isLoading && speakingExams.length === 0} />
          <TableCustom>
            <BasicTableHead>
              <BasicTableRow>
                {columns.map((column) => (
                  <TableCellCustom
                    key={column.id}
                    align="center"
                    border={true}
                    justifyContent="center"
                    alignItems="center"
                    minWidth={column.minWidth}
                    minHeight={column.minHeight}
                  >
                    <BasicTypography
                      variant="body2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {column.label}
                    </BasicTypography>
                  </TableCellCustom>
                ))}
              </BasicTableRow>
            </BasicTableHead>
            <BasicTableBody>
              {speakingExams.map((item, index) => {
                return (
                  <BasicTableRow key={index}>
                    <TableCellCustom
                      align="center"
                      border={true}
                      minHeight={40}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <BasicTypography variant="body2">
                        {item.examCode}
                      </BasicTypography>
                    </TableCellCustom>
                    <TableCellCustom
                      align="center"
                      border={true}
                      minHeight={40}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <BasicTypography variant="body2" component="span">
                        {item.title}
                      </BasicTypography>
                    </TableCellCustom>

                    <TableCellCustom
                      align="center"
                      border={true}
                      minHeight={40}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <BasicStack spacing={1}>
                        <BasicButton
                          variant="outlined"
                          color="info"
                          size="small"
                          startIcon={
                            <ContentPasteIcon sx={{ width: 16, height: 16 }} />
                          }
                          onClick={() =>
                            handleRegisterClick(item.termId, item.examId)
                          }
                        >
                          <BasicTypography variant="body2">
                            Đăng ký
                          </BasicTypography>
                        </BasicButton>
                      </BasicStack>
                    </TableCellCustom>
                  </BasicTableRow>
                );
              })}
            </BasicTableBody>
          </TableCustom>
        </BasicTableContainer>
        <TablePaginationCustom
          id="user-history_table-pagination"
          page={filter.pageNumber || 0}
          pageSize={filter.pageSize || 0}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          total={totalItems}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </BasicStack>
      <RegisterForPointingDialog
        open={openRegisterForSpeakingPoint}
        onClose={() => setOpenRegisterForSpeakingPoint(false)}
        onConfirm={onConfirmRegisterForSpeakingPoint}
        termId={selectedTermId}
        examId={selectedExamId}
      />
    </BasicPaper>
  );
};

export default UserSpeakingTable;
