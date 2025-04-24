import { RegisterRequest } from "@/services/types/auth";
import { object, string } from "yup";

// Define the validation schema for register form
export const registerValidate = () => {
  return object<RegisterRequest>().shape({
    username: string().required("Username is required"),
    password: string().required("Password is required"),
    email: string().required("Email is required"),
  });
};
