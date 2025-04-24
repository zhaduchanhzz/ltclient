"use client";
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
import { useMemo, useState } from "react";
import useExamScheduleFilter from "../hooks/useExamScheduleFilter";
import { getExamScheduleTableColumns } from "../utils/columns";
import { examScheduleSample } from "../utils/data";
import BasicTextField from "@/components/base/MaterialUI-Basic/TextField";

type ExamScheduleNationWideProps = {};

const ExamScheduleNationWide = (_: ExamScheduleNationWideProps) => {
  const columns = useMemo(() => getExamScheduleTableColumns(), []);
  const [totalItems, __] = useState<number>(0);
  const { onPageChange, onPageSizeChange, filter } = useExamScheduleFilter();

  return (
    <BasicStack spacing={2}>
      <BasicTypography variant="h6">
        Tra cứu lịch thi VSTEP toàn quốc
      </BasicTypography>
      <BasicStack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <BasicStack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <BasicTypography variant="body2" sx={{ minWidth: 70 }}>
            Tìm kiếm:
          </BasicTypography>
          <BasicTextField size="small" />
        </BasicStack>
        <TablePaginationCustom
          id="nation-wide_table-pagination"
          page={filter.pageNumber || 0}
          pageSize={filter.pageSize || 0}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          total={totalItems}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      </BasicStack>
      <BasicTableContainer id="user-info_table" sx={{ minHeight: 430 }}>
        <LoadingOverlay visible={examScheduleSample.length === 0} />
        <NoDataOverlay visible={examScheduleSample.length === 0} />
        <TableCustom>
          <BasicTableHead>
            <BasicTableRow>
              {columns.map((column) => (
                <TableCellCustom
                  key={column.id}
                  align="center"
                  border={true}
                  backgroundEmphasize={true}
                  justifyContent="center"
                  alignItems="center"
                  minWidth={column.minWidth}
                  minHeight={column.minHeight}
                >
                  <BasicTypography variant="body2" sx={{ fontWeight: "bold" }}>
                    {column.label}
                  </BasicTypography>
                </TableCellCustom>
              ))}
            </BasicTableRow>
          </BasicTableHead>
          <BasicTableBody>
            {examScheduleSample.map((item, index) => (
              <BasicTableRow key={index}>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2">{index + 1}</BasicTypography>
                </TableCellCustom>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2">{item.date}</BasicTypography>
                </TableCellCustom>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2" component="span">
                    {item.days}
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
                    {item.organizer}
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
                    {item.deadline}
                  </BasicTypography>
                </TableCellCustom>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </TableCustom>
      </BasicTableContainer>
      <TablePaginationCustom
        id="nation-wide_table-pagination"
        page={filter.pageNumber || 0}
        pageSize={filter.pageSize || 0}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        total={totalItems}
        rowsPerPageOptions={[5, 10, 20, 50]}
      />
    </BasicStack>
  );
};

export default ExamScheduleNationWide;
