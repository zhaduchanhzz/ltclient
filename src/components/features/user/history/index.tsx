"use client";
import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useMemo, useState } from "react";
import useUserHistoryFilter from "./hooks/useUserHistoryFilter";
import { getUserHistoryTableColumns } from "./utils/columns";
import { examScheduleData } from "./utils/data";

type UserHistoryProps = {};

const UserHistory = (_: UserHistoryProps) => {
  const columns = useMemo(() => getUserHistoryTableColumns(), []);
  const [totalItems, __] = useState<number>(0);

  const { onPageChange, onPageSizeChange, filter } = useUserHistoryFilter();

  return (
    <BasicPaper sx={{ p: 2 }}>
      <BasicStack spacing={2}>
        <BasicTableContainer id="user-history_table" sx={{ minHeight: 430 }}>
          <LoadingOverlay visible={examScheduleData.length === 0} />
          <NoDataOverlay visible={examScheduleData.length === 0} />
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
              {examScheduleData.map((item) => (
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
                      {item.listeningScore}
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
                      {item.readingScore}
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
                      {item.writingScore}
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
                      {item.speakingScore}
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
                      {item.finalScore}
                    </BasicTypography>
                  </TableCellCustom>
                  <TableCellCustom
                    align="center"
                    border={true}
                    minHeight={40}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <BasicIconButton>
                      <VisibilityIcon />
                    </BasicIconButton>
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
    </BasicPaper>
  );
};

export default UserHistory;
