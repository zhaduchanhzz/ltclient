import Home from "@/components/features/home/home-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ",
};

const HomePage = () => {
  return <Home />;
};

export default HomePage;
