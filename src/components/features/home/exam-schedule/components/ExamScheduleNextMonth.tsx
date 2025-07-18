"use client";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTableBody from "@/components/base/MaterialUI-Basic/Table/BasicTableBody";
import BasicTableContainer from "@/components/base/MaterialUI-Basic/Table/BasicTableContainer";
import BasicTableHead from "@/components/base/MaterialUI-Basic/Table/BasicTableHead";
import BasicTableRow from "@/components/base/MaterialUI-Basic/Table/BasicTableRow";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import TableCustom from "@/components/base/MaterialUI-Table/Table";
import TableCellCustom from "@/components/base/MaterialUI-Table/TableCell";
import LoadingOverlay from "@/components/common/Overlay/LoadingOverlay";
import NoDataOverlay from "@/components/common/Overlay/NoDataOverlay";
import { useMemo } from "react";
import { getExamScheduleTableColumns } from "../utils/columns";
import { useGetRecentSchedulesQuery } from "@/services/apis/exam-schedules";

type ExamScheduleNextMonthProps = {};

const ExamScheduleNextMonth = (_: ExamScheduleNextMonthProps) => {
  const columns = useMemo(() => getExamScheduleTableColumns(), []);
  
  // Get next month and year
  const currentDate = new Date();
  const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const nextMonth = nextMonthDate.getMonth() + 1; // JavaScript months are 0-indexed
  const nextMonthYear = nextMonthDate.getFullYear();
  
  // Fetch recent schedules
  const { data, isLoading } = useGetRecentSchedulesQuery({
    page: 0,
    size: 20
  });

  // Filter schedules for next month
  const nextMonthData = data?.data?.content?.find(item => item.month === nextMonth);
  const nextMonthSchedules = nextMonthData?.schedules || [];

  // Format month display
  const monthName = nextMonthDate.toLocaleDateString('vi-VN', { month: 'numeric' });

  return (
    <BasicStack spacing={3}>
      <BasicTypography variant="h6">
        Lịch thi VSTEP tháng {monthName} năm {nextMonthYear}
      </BasicTypography>
      <BasicTableContainer id="next-month_table" sx={{ minHeight: 430 }}>
        <LoadingOverlay visible={isLoading} />
        <NoDataOverlay visible={!isLoading && nextMonthSchedules.length === 0} />
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
            {nextMonthSchedules.map((item, index) => (
              <BasicTableRow key={item.id}>
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
                  <BasicTypography variant="body2">{item.examDates}</BasicTypography>
                </TableCellCustom>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2" component="span">
                    {item.weekdays}
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
                    {new Date(item.registrationDeadline).toLocaleDateString('vi-VN')}
                  </BasicTypography>
                </TableCellCustom>
              </BasicTableRow>
            ))}
          </BasicTableBody>
        </TableCustom>
      </BasicTableContainer>
    </BasicStack>
  );
};

export default ExamScheduleNextMonth;