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
import { useMemo, useState } from "react";
import { getUserWritingTableColumns } from "../utils/columns";
import { userWritingData } from "../utils/data";
import useUserWritingFilter from "../hooks/useUserWritingFilter";
import RegisterForPointingDialog from "@/components/common/Dialog/RegisterForPointingDialog";
import ViewSpeakingWritingExamDialog from "@/components/common/Dialog/ViewSpeakingWritingExamDialog";
import { EXAM_SECTION } from "@/consts";

type UserWritingTableProps = {};

const UserWritingTable = (_: UserWritingTableProps) => {
  const columns = useMemo(() => getUserWritingTableColumns(), []);
  const [totalItems, __] = useState<number>(0);
  const [openRegisterForWritingPoint, setOpenRegisterForWritingPoint] =
    useState<boolean>(false);
  const [openViewWritingExamDialog, setOpenViewWritingExamDialog] =
    useState<boolean>(false);

  const { onPageChange, onPageSizeChange, filter } = useUserWritingFilter();

  const onConfirmRegisterForWritingPoint = () => {
    setOpenRegisterForWritingPoint(false);
  };

  return (
    <BasicPaper sx={{ p: 3 }}>
      <BasicStack spacing={2}>
        <BasicTableContainer id="user-history_table" sx={{ minHeight: 430 }}>
          <LoadingOverlay visible={userWritingData.length === 0} />
          <NoDataOverlay visible={userWritingData.length === 0} />
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
              {userWritingData.map((item) => (
                <BasicTableRow key={item.id}>
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
                      {item.essay1}
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
                      {item.essay2}
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
                        onClick={() => setOpenRegisterForWritingPoint(true)}
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
                        onClick={() => setOpenRegisterForWritingPoint(true)}
                      >
                        <BasicTypography variant="body2">
                          Xem bài
                        </BasicTypography>
                      </BasicButton>
                    </BasicStack>
                  </TableCellCustom>
                </BasicTableRow>
              ))}
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
      />
      <ViewSpeakingWritingExamDialog
        open={openViewWritingExamDialog}
        sectionType={EXAM_SECTION.SPEAKING}
        onClose={() => setOpenViewWritingExamDialog(false)}
      />
    </BasicPaper>
  );
};

export default UserWritingTable;
