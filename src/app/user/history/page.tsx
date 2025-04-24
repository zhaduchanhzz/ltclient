import UserHistory from "@/components/features/user/history";
import { Metadata } from "next";

type UserHistoryPageProps = {};

export const metadata: Metadata = {
  title: "Lịch sử thi",
  description: "Lịch sử thi",
};

const UserHistoryPage = (_: UserHistoryPageProps) => {
  return <UserHistory />;
};

export default UserHistoryPage;
