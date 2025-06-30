"use client";
import BasicAlert from "@/components/base/MaterialUI-Basic/Alert";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import HookForm from "@/components/base/MaterialUI-HookForm/HookForm";
import TextFieldHookForm from "@/components/base/MaterialUI-HookForm/TextFieldHookForm/Index";
import DarkNightChange from "@/components/common/DarkNightChange";
import { APP_ROUTE } from "@/consts/app-route";
import { useAppContextHandle } from "@/contexts/AppContext";
import { useRegisterMutation } from "@/services/apis/auth";
import { RegisterRequest } from "@/services/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerValidate } from "./utils/schema";
import { CircularProgress } from "@mui/material";

type RegisterPageProps = {};

const RegisterPage = (_: RegisterPageProps) => {
  const { push } = useRouter();
  const registerMutation = useRegisterMutation();
  const { updateAppState } = useAppContextHandle();
  const form = useForm<RegisterRequest>({
    mode: "onChange",
    resolver: yupResolver(registerValidate()),
    defaultValues: registerValidate().getDefault(),
  });

  // Get loading state from mutation
  const isLoading = registerMutation.isPending;

  const onFinish = (data: RegisterRequest) => {
    registerMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.code === 200) {
          updateAppState({
            appAlertInfo: {
              message: "Đăng ký thành công, đợi 3 giây để chuyển trang",
              severity: "success",
            },
          });
          setTimeout(() => {
            push(APP_ROUTE.LOGIN);
          }, 3000);
          return;
        }

        updateAppState({
          appAlertInfo: {
            message: "Đăng ký thất bại",
            severity: "error",
          },
        });
      },
      onError: (error: any) => {
        const errorMessage =
          error.response?.data?.message || "Đăng nhập thất bại";
        updateAppState({
          appAlertInfo: {
            message: errorMessage,
            severity: "error",
          },
        });
      },
    });
  };

  return (
    <HookForm<RegisterRequest>
      form={form}
      onFinish={onFinish}
      onError={() => {}}
    >
      <BasicGrid container spacing={4} sx={{ width: 450 }}>
        <BasicGrid
          container
          size={{ xs: 12 }}
          sx={{ justifyContent: "center" }}
        >
          <BasicTypography variant="h2">Đăng ký hệ thống thi</BasicTypography>
        </BasicGrid>
        <BasicGrid
          container
          size={{ xs: 12 }}
          sx={{ justifyContent: "center" }}
        >
          <BasicAlert severity="warning" sx={{ width: 1 }}>
            Hãy điền đầy đủ thông tin nhé
          </BasicAlert>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Tên người dùng</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="register-form-fullname"
              name="fullName"
              placeholder="Nhập tên người dùng"
              disabled={isLoading}
            />
          </BasicGrid>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Tài khoản</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="register-form-username"
              name="username"
              placeholder="Nhập tài khoản"
              disabled={isLoading}
            />
          </BasicGrid>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Email</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="register-form-email"
              name="email"
              placeholder="Nhập địa chỉ Email"
              disabled={isLoading}
            />
          </BasicGrid>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Số điện thoại</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="register-form-phone-number"
              name="phoneNumber"
              placeholder="Nhập số điện thoại"
              disabled={isLoading}
            />
          </BasicGrid>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Mật khẩu</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="register-form-password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              disabled={isLoading}
            />
          </BasicGrid>
        </BasicGrid>
        <BasicGrid
          container
          size={{ xs: 12 }}
          sx={{ justifyContent: "center" }}
        >
          <BasicButton
            id="register-submit-button"
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </BasicButton>
        </BasicGrid>
        <BasicGrid size={{ xs: 12 }}>
          <BasicTypography variant="body2" align="center">
            Nếu bạn đã có tài khoản, vui lòng
            <BasicNextLink href={APP_ROUTE.LOGIN} className="loginLink">
              {" "}
              đăng nhập tại đây
            </BasicNextLink>
            ,
          </BasicTypography>
          <BasicTypography variant="body2" align="center">
            hoặc
            <BasicNextLink href={APP_ROUTE.HOME}>
              {" "}
              quay lại trang chủ tại đây.
            </BasicNextLink>
          </BasicTypography>
        </BasicGrid>
        <BasicGrid size={12} container sx={{ justifyContent: "center" }}>
          <DarkNightChange />
        </BasicGrid>
      </BasicGrid>
    </HookForm>
  );
};

export default RegisterPage;
