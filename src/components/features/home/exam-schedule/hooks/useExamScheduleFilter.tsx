import { useState } from "react";
import { SearchExamScheduleRequest } from "../utils/types";

const useExamScheduleFilter = () => {
  const [filter, setFilter] = useState<SearchExamScheduleRequest>({
    pageSize: 20,
    pageNumber: 1,
  });

  const onPageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, pageNumber: page }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize: pageSize }));
  };

  const onSearch = (params: Partial<SearchExamScheduleRequest>) => {
    setFilter((state) => ({
      ...state,
      ...params,
      pageNumber: 1,
    }));
  };

  return {
    filter,
    onSearch,
    onPageChange,
    onPageSizeChange,
  };
};

export default useExamScheduleFilter;
