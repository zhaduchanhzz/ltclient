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
import LoadingOverlay from "@/components/common/Overlay/LoadingOverlay";
import NoDataOverlay from "@/components/common/Overlay/NoDataOverlay";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMemo, useState, useEffect } from "react";
import { getUserWritingTableColumns } from "../utils/columns";
import useUserWritingFilter from "../hooks/useUserWritingFilter";
import RegisterForPointingDialog from "@/components/common/Dialog/RegisterForPointingDialog";
import ViewSpeakingWritingExamDialog from "@/components/common/Dialog/ViewSpeakingWritingExamDialog";
import { EXAM_SECTION } from "@/consts";
import { useGetUserHistoryQuery } from "@/services/apis/exam";
import { UserHistory } from "@/services/types/exam";

type UserWritingTableProps = {};

const UserWritingTable = (_: UserWritingTableProps) => {
  const columns = useMemo(() => getUserWritingTableColumns(), []);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openRegisterForWritingPoint, setOpenRegisterForWritingPoint] =
    useState<boolean>(false);
  const [openViewWritingExamDialog, setOpenViewWritingExamDialog] =
    useState<boolean>(false);
  const [selectedExamData, setSelectedExamData] = useState<any>(null);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [writingExams, setWritingExams] = useState<any[]>([]);

  const { onPageChange, onPageSizeChange, filter } = useUserWritingFilter();

  const { data: historyData, isLoading } = useGetUserHistoryQuery(true);

  useEffect(() => {
    if (historyData?.data && Array.isArray(historyData.data)) {
      const writingData: any[] = [];
      historyData.data.forEach((history: UserHistory) => {
        const writingExam = history.exams.find(
          (exam) => exam.examType === "WRITING",
        );

        if (writingExam) {
          writingData.push({
            termId: history.termId,
            examCode: history.termId,
            examId: writingExam.examId,
            responses: writingExam.responses || [],
            examScore: writingExam.examScore,
            createdAt: history.createdAt,
          });
        }
      });
      setWritingExams(writingData);
      setTotalItems(writingData.length);
    } else {
      // Handle case where data is not an array or doesn't exist
      setWritingExams([]);
      setTotalItems(0);
    }
  }, [historyData]);

  const onConfirmRegisterForWritingPoint = () => {
    setOpenRegisterForWritingPoint(false);
  };

  const handleRegisterClick = (termId: number, examId: number) => {
    setSelectedTermId(termId);
    setSelectedExamId(examId);
    setOpenRegisterForWritingPoint(true);
  };

  const handleViewExamClick = (responses: any[]) => {
    setSelectedExamData(responses);
    setOpenViewWritingExamDialog(true);
  };

  return (
    <BasicPaper sx={{ p: 3 }}>
      <BasicStack spacing={2}>
        <BasicTableContainer id="user-history_table" sx={{ minHeight: 430 }}>
          <LoadingOverlay visible={isLoading} />
          <NoDataOverlay visible={!isLoading && writingExams.length === 0} />
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
              {writingExams.map((item, index) => {
                const essay1 = item.responses[0];
                const essay2 = item.responses[1];

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
                        {essay1?.content ? "Đã làm" : "Chưa làm"}
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
                        {essay2?.content ? "Đã làm" : "Chưa làm"}
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
                        <BasicButton
                          variant="outlined"
                          color="info"
                          size="small"
                          startIcon={
                            <VisibilityIcon sx={{ width: 16, height: 16 }} />
                          }
                          onClick={() => handleViewExamClick(item.responses)}
                        >
                          <BasicTypography variant="body2">
                            Xem bài
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
        open={openRegisterForWritingPoint}
        onClose={() => setOpenRegisterForWritingPoint(false)}
        onConfirm={onConfirmRegisterForWritingPoint}
        termId={selectedTermId}
        examId={selectedExamId}
      />
      <ViewSpeakingWritingExamDialog
        open={openViewWritingExamDialog}
        sectionType={EXAM_SECTION.WRITING}
        onClose={() => setOpenViewWritingExamDialog(false)}
        examData={selectedExamData}
      />
    </BasicPaper>
  );
};

export default UserWritingTable;
