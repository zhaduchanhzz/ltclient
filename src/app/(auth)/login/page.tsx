import LoginPage from "@/components/features/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập",
};

const Login = () => {
  return <LoginPage />;
};

export default Login;
