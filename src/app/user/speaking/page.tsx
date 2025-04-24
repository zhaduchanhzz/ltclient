import UserSpeaking from "@/components/features/user/speaking";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh sách bài nói",
  description: "Danh sách bài nói",
};

type UserSpeakingPageProps = {};

const UserSpeakingPage = (_: UserSpeakingPageProps) => {
  return <UserSpeaking />;
};

export default UserSpeakingPage;
