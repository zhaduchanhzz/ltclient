import { object, string } from "yup";

// Define the validation schema for login form
export const loginValidate = () => {
  return object().shape({
    username: string().required("Username is required"),
    password: string().required("Password is required"),
  });
};
