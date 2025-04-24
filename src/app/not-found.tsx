"use client";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import styles from "./not-found.module.scss";
import PhoneIcon from "@mui/icons-material/Phone";
import { useRouter } from "next/navigation";
import { APP_ROUTE } from "@/consts/app-route";

export default function NotFound() {
  const { push } = useRouter();

  return (
    <Stack spacing={5} className={clsx(styles.container)}>
      <Typography variant="h1">404</Typography>
      <Typography variant="h2">Không tìm thấy trang</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => push(APP_ROUTE.HOME)}>
          <Stack
            spacing={1}
            direction="row"
            justifyItems="center"
            alignItems="center"
          >
            <HomeIcon />
            <Typography variant="body1">Trang chủ</Typography>
          </Stack>
        </Button>
        <Button variant="outlined">
          <Stack
            spacing={1}
            direction="row"
            justifyItems="center"
            alignItems="center"
          >
            <PhoneIcon />
            <Typography variant="body1">Liên hệ với chúng tôi</Typography>
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
}
