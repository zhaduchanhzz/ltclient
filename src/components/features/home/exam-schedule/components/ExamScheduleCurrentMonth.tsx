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
import { examScheduleSample } from "../utils/data";

type ExamScheduleCurrentMonthProps = {};

const ExamScheduleCurrentMonth = (_: ExamScheduleCurrentMonthProps) => {
  const columns = useMemo(() => getExamScheduleTableColumns(), []);

  return (
    <BasicStack spacing={3}>
      <BasicTypography variant="h6">
        Lịch thi VSTEP tháng 03 năm 2025
      </BasicTypography>
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
    </BasicStack>
  );
};

export default ExamScheduleCurrentMonth;
