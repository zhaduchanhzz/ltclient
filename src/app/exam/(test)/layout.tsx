import ExamLayout from "@/components/layouts/exam-layout";
import { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return <ExamLayout>{children}</ExamLayout>;
};

export default Layout;
