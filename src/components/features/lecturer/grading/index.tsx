"use client";

import BasicPaper from "@/components/base/MaterialUI-Basic/Paper";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicTextField from "@/components/base/MaterialUI-Basic/TextField";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicTableContainer from "@/components/base/MaterialUI-Basic/Table/BasicTableContainer";
import BasicTableHead from "@/components/base/MaterialUI-Basic/Table/BasicTableHead";
import BasicTableBody from "@/components/base/MaterialUI-Basic/Table/BasicTableBody";
import BasicTableRow from "@/components/base/MaterialUI-Basic/Table/BasicTableRow";
import TableCustom from "@/components/base/MaterialUI-Table/Table";
import TableCellCustom from "@/components/base/MaterialUI-Table/TableCell";
import TablePaginationCustom from "@/components/base/MaterialUI-Table/TablePagination";
import LoadingOverlay from "@/components/common/Overlay/LoadingOverlay";
import NoDataOverlay from "@/components/common/Overlay/NoDataOverlay";
import BasicChip from "@/components/base/MaterialUI-Basic/Chip";
import BasicIconButton from "@/components/base/MaterialUI-Basic/IconButton";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import {
  Grade as GradeIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useState, useMemo } from "react";
import {
  useGetUserResponsesQuery,
  useGradeResponseMutation,
} from "@/services/apis/lecturer";
import { UserResponse } from "@/services/types/lecturer";

const LecturerGrading = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    userId: undefined as number | undefined,
    questionId: undefined as number | undefined,
    termId: undefined as number | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useGetUserResponsesQuery({
    page,
    size: pageSize,
    ...filters,
  });

  const { mutate: gradeResponse } = useGradeResponseMutation();

  const columns = useMemo(
    () => [
      { id: "question", label: "Question ID", minWidth: 30 },
      { id: "questionText", label: "Question", minWidth: 200 },
      { id: "content", label: "Response", minWidth: 200 },
      { id: "score", label: "Score", minWidth: 80 },
      { id: "status", label: "Status", minWidth: 100 },
      { id: "actions", label: "Actions", minWidth: 120 },
    ],
    [],
  );

  const handleGrade = (response: UserResponse) => {
    // This would open a dialog or navigate to grading form
    console.log("Grade response:", response);
  };

  const handleView = (response: UserResponse) => {
    // This would open a dialog to view the full response
    console.log("View response:", response);
  };

  const getStatusChip = (score: number | null) => {
    if (score === null) {
      return <BasicChip label="Ungraded" color="default" size="small" />;
    }
    return <BasicChip label="Graded" color="success" size="small" />;
  };

  return (
    <BasicStack spacing={3}>
      <BasicStack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <BasicTypography variant="h4" color="text.primary">
          Danh sách chấm điểm
        </BasicTypography>
        <BasicButton
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters
        </BasicButton>
      </BasicStack>

      {showFilters && (
        <BasicPaper sx={{ p: 2 }}>
          <BasicGrid container spacing={2}>
            <BasicGrid size={{ xs: 12, sm: 4 }}>
              <BasicTextField
                label="User ID"
                type="number"
                fullWidth
                size="small"
                value={filters.userId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    userId: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </BasicGrid>
            <BasicGrid size={{ xs: 12, sm: 4 }}>
              <BasicTextField
                label="Question ID"
                type="number"
                fullWidth
                size="small"
                value={filters.questionId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    questionId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </BasicGrid>
            <BasicGrid size={{ xs: 12, sm: 4 }}>
              <BasicTextField
                label="Term ID"
                type="number"
                fullWidth
                size="small"
                value={filters.termId || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    termId: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </BasicGrid>
          </BasicGrid>
        </BasicPaper>
      )}

      <BasicPaper>
        <BasicTableContainer sx={{ minHeight: 500 }}>
          <LoadingOverlay visible={isLoading} />
          <NoDataOverlay
            visible={
              !isLoading && (!data?.content || data.content.length === 0)
            }
          />
          <TableCustom stickyHeader>
            <BasicTableHead>
              <BasicTableRow>
                {columns.map((column) => (
                  <TableCellCustom
                    key={column.id}
                    align="center"
                    minWidth={column.minWidth}
                    backgroundEmphasize
                  >
                    <BasicTypography variant="body2" fontWeight="bold">
                      {column.label}
                    </BasicTypography>
                  </TableCellCustom>
                ))}
              </BasicTableRow>
            </BasicTableHead>
            <BasicTableBody>
              {data?.content?.map((response: UserResponse, index: number) => (
                <BasicTableRow key={index}>
                  <TableCellCustom align="center">
                    {response.questionId}
                  </TableCellCustom>
                  <TableCellCustom>
                    <BasicTypography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                      }}
                    >
                      {response.questionText}
                    </BasicTypography>
                  </TableCellCustom>
                  <TableCellCustom>
                    <BasicTypography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 200,
                      }}
                    >
                      {response.content}
                    </BasicTypography>
                  </TableCellCustom>
                  <TableCellCustom align="center">
                    {response.score !== null ? response.score : "-"}
                  </TableCellCustom>
                  <TableCellCustom align="center">
                    {getStatusChip(response.score)}
                  </TableCellCustom>
                  <TableCellCustom align="center">
                    <BasicStack
                      direction="row"
                      spacing={1}
                      justifyContent="center"
                    >
                      <BasicIconButton
                        size="small"
                        color="primary"
                        onClick={() => handleView(response)}
                        title="View"
                      >
                        <VisibilityIcon fontSize="small" />
                      </BasicIconButton>
                      {response.score === null && (
                        <BasicIconButton
                          size="small"
                          color="success"
                          onClick={() => handleGrade(response)}
                          title="Grade"
                        >
                          <GradeIcon fontSize="small" />
                        </BasicIconButton>
                      )}
                    </BasicStack>
                  </TableCellCustom>
                </BasicTableRow>
              ))}
            </BasicTableBody>
          </TableCustom>
        </BasicTableContainer>

        <BasicStack sx={{ p: 2 }}>
          <TablePaginationCustom
            id="grading-table-pagination"
            page={page}
            pageSize={pageSize}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(0);
            }}
            total={data?.totalElements || 0}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </BasicStack>
      </BasicPaper>
    </BasicStack>
  );
};

export default LecturerGrading;
