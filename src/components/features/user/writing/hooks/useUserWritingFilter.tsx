import { useState } from "react";
import { SearchUserWritingRequest } from "../utils/types";

const useUserWritingFilter = () => {
  const [filter, setFilter] = useState<SearchUserWritingRequest>({
    pageSize: 20,
    pageNumber: 1,
  });

  const onPageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, pageNumber: page }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize: pageSize }));
  };

  const onSearch = (params: Partial<SearchUserWritingRequest>) => {
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

export default useUserWritingFilter;
