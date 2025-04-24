import Subcription from "@/components/features/home/subcription";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gói ôn luyện và chấm thi VSTEP",
  description: "Gói ôn luyện và chấm thi VSTEP",
};

type SubcriptionPageProps = {};

const SubcriptionPage = (_: SubcriptionPageProps) => {
  return <Subcription />;
};

export default SubcriptionPage;
