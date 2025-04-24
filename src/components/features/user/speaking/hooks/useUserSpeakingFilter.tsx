import { useState } from "react";
import { SearchUserSpeakingRequest } from "../utils/types";

const useUserHistoryFilter = () => {
  const [filter, setFilter] = useState<SearchUserSpeakingRequest>({
    pageSize: 20,
    pageNumber: 1,
  });

  const onPageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, pageNumber: page }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, pageSize: pageSize }));
  };

  const onSearch = (params: Partial<SearchUserSpeakingRequest>) => {
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

export default useUserHistoryFilter;
