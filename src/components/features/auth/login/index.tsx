"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import HookForm from "@/components/base/MaterialUI-HookForm/HookForm";
import TextFieldHookForm from "@/components/base/MaterialUI-HookForm/TextFieldHookForm/Index";
import DarkNightChange from "@/components/common/DarkNightChange";
import { APP_COOKIE_KEY } from "@/consts";
import CookieStorage from "@/utils/cookie-storage";
import { APP_ROUTE } from "@/consts/app-route";
import { useAppContextHandle } from "@/contexts/AppContext";
import { useLoginMutation, useProfileQuery } from "@/services/apis/auth";
import { LoginRequest } from "@/services/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginValidate } from "./utils/schema";
import { CircularProgress } from "@mui/material";

const LoginPage = () => {
  const { push } = useRouter();
  const loginMutation = useLoginMutation();
  const { updateAppState } = useAppContextHandle();
  const profileQuery = useProfileQuery();
  const form = useForm<LoginRequest>({
    mode: "onChange",
    resolver: yupResolver(loginValidate()),
    defaultValues: loginValidate().getDefault(),
  });

  // Get loading state from mutation
  const isLoading = loginMutation.isPending;

  const onFinish = (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.code === 200) {
          updateAppState({
            appAlertInfo: {
              message: "Đăng nhập thành công",
              severity: "success",
            },
          });
          CookieStorage.set(
            APP_COOKIE_KEY.ACCESS_TOKEN,
            response.data.accessToken,
          );
          CookieStorage.setBoolean(APP_COOKIE_KEY.IS_AUTHENTICATED, true);
          profileQuery.refetch();
          push(APP_ROUTE.HOME);
          return;
        }

        updateAppState({
          appAlertInfo: {
            message: "Đăng nhập thất bại",
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
    <HookForm form={form} onFinish={onFinish}>
      <BasicGrid
        container
        spacing={4}
        sx={{
          width: { xs: "100%", sm: 450 },
          maxWidth: "100%",
          px: { xs: 2, sm: 0 },
        }}
      >
        <BasicGrid
          container
          size={{ xs: 12 }}
          sx={{ justifyContent: "center" }}
        >
          <BasicTypography variant="h2">Đăng nhập hệ thống thi</BasicTypography>
        </BasicGrid>
        {/* <BasicGrid
          container
          size={{ xs: 12 }}
          sx={{ justifyContent: "center" }}
        >
          <BasicAlert severity="error" sx={{ width: 1 }}>
            Bạn đã đăng xuất khỏi hệ thống
          </BasicAlert>
        </BasicGrid> */}

        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicTypography>Username</BasicTypography>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <TextFieldHookForm
              id="login-form-username"
              name="username"
              placeholder="Enter Username"
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
              type="password"
              id="login-form-password"
              name="password"
              placeholder="Enter Password"
              autoComplete="off"
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
            id="login-submit-button"
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
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </BasicButton>
        </BasicGrid>
        <BasicGrid size={{ xs: 12 }}>
          <BasicTypography variant="body2" align="center">
            Nếu bạn chưa có tài khoản, vui lòng
            <BasicNextLink href={APP_ROUTE.REGISTER}>
              {" "}
              đăng ký tại đây
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

export default LoginPage;
