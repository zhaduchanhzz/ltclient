import RegisterPage from "@/components/features/auth/register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
  description: "Đăng ký tài khoản",
};

const Register = () => {
  return <RegisterPage />;
};

export default Register;
