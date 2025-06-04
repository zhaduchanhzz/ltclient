import { RegisterRequest } from "@/services/types/auth";
import { object, string } from "yup";

// Define the validation schema for register form
export const registerValidate = () => {
  return object<RegisterRequest>().shape({
    username: string()
      .required("Tài khoản là bắt buộc")
      .min(3, "Tài khoản phải có ít nhất 3 ký tự")
      .max(30, "Tài khoản không được vượt quá 30 ký tự")
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "Tài khoản chỉ được chứa các ký tự chữ cái, số, dấu gạch dưới và dấu gạch ngang",
      ),
    password: string()
      .required("Mật khẩu là bắt buộc")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .max(50, "Mật khẩu không được vượt quá 50 ký tự"),
    email: string()
      .required("Email là bắt buộc")
      .email("Vui lòng nhập địa chỉ email hợp lệ")
      .max(255, "Email không được vượt quá 255 ký tự"),
    phoneNumber: string().min(10, "Số điện thoại phải có 10 số"),
    fullName: string()
      .min(3, "Họ tên phải có ít nhất 3 ký tự")
      .max(100, "Họ tên không được vượt quá 100 ký tự"),
  });
};
