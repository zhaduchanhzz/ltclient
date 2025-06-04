"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import HookForm from "@/components/base/MaterialUI-HookForm/HookForm";
import TextFieldHookForm from "@/components/base/MaterialUI-HookForm/TextFieldHookForm/Index";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useForm } from "react-hook-form";
import UserInfoCard from "./components/UserInfoCard";

type UserGeneralProps = {};

const UserGeneral = (_: UserGeneralProps) => {
  const form = useForm();

  const onFinish = (data: any) => {
    console.log(data);
  };

  return (
    <HookForm form={form} onFinish={onFinish}>
      <BasicGrid container spacing={2}>
        <BasicGrid container size={{ xs: 6 }} spacing={2}>
          <BasicGrid container spacing={1} size={{ xs: 12 }}>
            <BasicTypography variant="body1">Họ tên</BasicTypography>
            <TextFieldHookForm
              name="fullname"
              size="small"
              placeholder="Nhập họ và tên"
            />
          </BasicGrid>
          <BasicGrid container spacing={1} size={{ xs: 12 }}>
            <BasicTypography variant="body1">Địa chỉ email</BasicTypography>
            <TextFieldHookForm
              name="email"
              size="small"
              placeholder="Nhập địa chỉ email"
            />
          </BasicGrid>
          <BasicGrid container spacing={1} size={{ xs: 12 }}>
            <BasicTypography variant="body1">Số điện thoại</BasicTypography>
            <TextFieldHookForm
              name="phone"
              size="small"
              placeholder="Nhập số điện thoại"
            />
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}></BasicGrid>
          <BasicButton
            type="submit"
            color="info"
            startIcon={<BorderColorIcon />}
          >
            <BasicTypography variant="body1">
              Cập nhật thông tin
            </BasicTypography>
          </BasicButton>
        </BasicGrid>
        <BasicGrid
          container
          size={{ xs: 6 }}
          sx={{ justifyContent: "flex-end" }}
        >
          <UserInfoCard />
        </BasicGrid>
      </BasicGrid>
    </HookForm>
  );
};

export default UserGeneral;
