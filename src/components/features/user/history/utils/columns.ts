import { Column } from "@/types/common";

export const getUserHistoryTableColumns = () => {
  const columns: Column[] = [];

  columns.push(
    {
      id: "Mã lượt thi",
      label: "Mã lượt thi",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Điểm nghe",
      label: "Điểm nghe",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Điểm đọc",
      label: "Điểm đọc",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Điểm viết",
      label: "Điểm viết",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Điểm nói",
      label: "Điểm nói",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Điểm cuối",
      label: "Điểm cuối",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Xem lại bài thi",
      label: "Xem lại bài thi",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
  );

  return [...columns];
};
