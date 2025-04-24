import UserWriting from "@/components/features/user/writing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách bài nói",
  description: "Danh sách bài nói",
};

type UserWritingPageProps = {};

const UserWritingPage = (_: UserWritingPageProps) => {
  return <UserWriting />;
};

export default UserWritingPage;
