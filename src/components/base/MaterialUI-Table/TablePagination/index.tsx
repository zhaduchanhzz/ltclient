import FormControl from "@mui/material/FormControl";
import type { SelectChangeEvent } from "@mui/material/Select";
import { selectClasses } from "@mui/material/Select";
import type { ChangeEvent, RefObject } from "react";
import BasicBox from "../../MaterialUI-Basic/Box";
import BasicMenuItem from "../../MaterialUI-Basic/Menu/BasicMenuItem";
import BasicPagination from "../../MaterialUI-Basic/Pagination";
import BasicSelect from "../../MaterialUI-Basic/Select";
import BasicTypography from "../../MaterialUI-Basic/Typography";

/**
 * Defines the properties for the TablePaginationCustom component.
 *
 * Properties:
 * - `id`: An optional string to uniquely identify the pagination component.
 * - `pageSize`: The number of rows displayed per page.
 * - `page`: The current page number (zero-indexed).
 * - `rowsPerPageOptions`: An optional array of numbers representing the selectable options for rows per page.
 * - `total`: The total number of rows available across all pages.
 * - `onPageChange`: A callback function invoked when the page number changes, receiving the new page number as an argument.
 * - `onPageSizeChange`: A callback function invoked when the number of rows per page changes, receiving the new page size as an argument.
 * - `tableRef`: An optional reference to the table element, useful for managing focus or scroll behavior.
 */
type TablePaginationCustomProps = {
  id?: string;
  pageSize: number;
  page: number;
  rowsPerPageOptions?: number[];
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  tableRef?: RefObject<HTMLDivElement>;
};

const TablePaginationCustom = (props: TablePaginationCustomProps) => {
  const {
    id,
    pageSize,
    page,
    total,
    onPageChange,
    onPageSizeChange,
    rowsPerPageOptions = [10, 25, 50, 100],
    tableRef,
  } = props;

  const handleChange = (_event: ChangeEvent<unknown>, value: number) => {
    onPageChange(value);

    if (tableRef?.current) {
      tableRef.current.scrollTop = 0;
    }
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    onPageSizeChange(Number(event.target.value));
    onPageChange(1);

    if (tableRef?.current) {
      tableRef.current.scrollTop = 0;
    }
  };

  const count = Math.ceil(total / pageSize);

  return (
    <BasicBox
      id={id}
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 1.5,
        alignItems: "center",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <BasicBox sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        <BasicBox sx={{ display: "flex", alignItems: "center" }}>
          <BasicTypography
            variant="subtitle2"
            sx={{ display: { xs: "none", sm: "revert" } }}
          >
            Số luợng trên trang:
          </BasicTypography>
          <FormControl sx={{ mx: 1.5 }}>
            <BasicSelect<number>
              size="small"
              variant="standard"
              value={pageSize}
              onChange={handlePageSizeChange}
              MenuProps={{
                MenuListProps: { dense: true },
              }}
              disableUnderline
              sx={{
                [`& .${selectClasses.select}`]: {
                  display: "flex",
                  alignItems: "center",
                  pb: 0,
                },
              }}
            >
              {rowsPerPageOptions.map((rowsPerPage) => (
                <BasicMenuItem key={rowsPerPage} value={rowsPerPage}>
                  <BasicTypography variant="subtitle2">
                    {rowsPerPage}
                  </BasicTypography>
                </BasicMenuItem>
              ))}
            </BasicSelect>
          </FormControl>
        </BasicBox>
        <BasicTypography variant="subtitle2">
          {count === 0 ? 0 : (page - 1) * pageSize + 1}-{page * pageSize} {"/"}{" "}
          Tổng {total}
        </BasicTypography>
      </BasicBox>
      <BasicPagination
        shape="rounded"
        showFirstButton
        showLastButton
        size="medium"
        count={count}
        page={page}
        onChange={handleChange}
      />
    </BasicBox>
  );
};

export default TablePaginationCustom;
