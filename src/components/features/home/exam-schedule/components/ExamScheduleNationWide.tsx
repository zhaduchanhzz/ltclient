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
import { useMemo, useState, useEffect } from "react";
import useExamScheduleFilter from "../hooks/useExamScheduleFilter";
import { getExamScheduleTableColumns } from "../utils/columns";
import BasicTextField from "@/components/base/MaterialUI-Basic/TextField";
import { useGetExamSchedulesQuery } from "@/services/apis/exam-schedules";
import { InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { ExamSchedule } from "@/services/types/exam-schedule";

type ExamScheduleNationWideProps = {};

const ExamScheduleNationWide = (_: ExamScheduleNationWideProps) => {
  const columns = useMemo(() => getExamScheduleTableColumns(), []);
  const { onPageChange, onPageSizeChange, filter } = useExamScheduleFilter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Simple debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all exam schedules
  const { data, isLoading } = useGetExamSchedulesQuery(true);

  // Client-side filtering
  const filteredSchedules = useMemo(() => {
    if (!data) return [];

    let schedules = Array.isArray(data) ? data : [];

    // Apply search filter
    if (debouncedSearchTerm) {
      schedules = schedules.filter((schedule: ExamSchedule) =>
        schedule.organizer
          ?.toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()),
      );
    }

    return schedules;
  }, [data, debouncedSearchTerm]);

  // Client-side pagination
  const paginatedSchedules = useMemo(() => {
    const startIndex = (filter.pageNumber || 0) * (filter.pageSize || 10);
    const endIndex = startIndex + (filter.pageSize || 10);
    return filteredSchedules.slice(startIndex, endIndex);
  }, [filteredSchedules, filter.pageNumber, filter.pageSize]);

  const totalItems = filteredSchedules.length;

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
          <BasicTextField
            size="small"
            placeholder="Tìm theo tên tổ chức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
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
        <LoadingOverlay visible={isLoading} />
        <NoDataOverlay
          visible={!isLoading && paginatedSchedules.length === 0}
        />
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
            {paginatedSchedules.map((item: ExamSchedule, index: number) => (
              <BasicTableRow key={item.id}>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2">
                    {(filter.pageNumber || 0) * (filter.pageSize || 10) +
                      index +
                      1}
                  </BasicTypography>
                </TableCellCustom>
                <TableCellCustom
                  align="center"
                  border={true}
                  minHeight={40}
                  alignItems="center"
                  justifyContent="center"
                >
                  <BasicTypography variant="body2">
                    {item.examDates}
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
                    {new Date(item.registrationDeadline).toLocaleDateString(
                      "vi-VN",
                    )}
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
