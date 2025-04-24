import { Column } from "@/types/common";

export const getExamScheduleTableColumns = () => {
  const columns: Column[] = [];

  columns.push(
    {
      id: "STT",
      label: "STT",
      minWidth: 50,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Ngày thi",
      label: "Ngày thi",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Thứ trong tuần",
      label: "Thứ trong tuần",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Đơn vị tổ chức thi",
      label: "Đơn vị tổ chức thi",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
    {
      id: "Hạn cuối đăng ký",
      label: "Hạn cuối đăng ký",
      minWidth: 100,
      minHeight: 40,
      align: "center",
      sticky: true,
    },
  );

  return [...columns];
};
