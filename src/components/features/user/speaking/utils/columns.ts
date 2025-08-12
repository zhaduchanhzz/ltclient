import { Column } from "@/types/common";

export const getUserSpeakingTableColumns = () => {
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
      id: "Bài nói số 1",
      label: "Bài nói số 1",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Đăng ký chấm",
      label: "Đăng ký chấm",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
  );

  return [...columns];
};
