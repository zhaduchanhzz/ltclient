import RegisterPage from "@/components/features/auth/register";
import { constructMetadata } from "@/utils/metadata";

export const metadata = constructMetadata({
  title: "Đăng ký tài khoản",
  description: "Đăng ký tài khoản miễn phí để bắt đầu luyện thi VSTEP online. Truy cập hơn 10,000 câu hỏi và nhận chấm thi tự động.",
});

const Register = () => {
  return <RegisterPage />;
};

export default Register;
