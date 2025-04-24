import UserGeneral from "@/components/features/user/general";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thông tin chung",
  description: "Thông tin chung",
};

type UserGeneralPageProps = {};

const UserGeneralPage = (_: UserGeneralPageProps) => {
  return <UserGeneral />;
};

export default UserGeneralPage;
