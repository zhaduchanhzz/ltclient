import LoginPage from "@/components/features/auth/login";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Đăng nhập",
  description: "Đăng nhập vào hệ thống luyện thi VSTEP online. Truy cập ngân hàng câu hỏi và theo dõi tiến độ học tập của bạn.",
});

const Login = () => {
  return <LoginPage />;
};

export default Login;
