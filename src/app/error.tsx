"use client"; // Error components must be Client Components

import ReplayIcon from "@mui/icons-material/Replay";
import { Button, Stack, Typography } from "@mui/material";
import clsx from "clsx";
import { useEffect } from "react";

import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Stack spacing={5} className={clsx(styles.container)}>
      <Typography variant="h1">Error!</Typography>
      <Typography variant="h3">Có vẻ hệ thống đã bị lỗi</Typography>
      <Typography variant="h5">Vui lòng thử lại sau</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={() => reset()}>
          <Stack
            spacing={1}
            direction="row"
            justifyItems="center"
            alignItems="center"
          >
            <ReplayIcon />
            <Typography variant="body1">Thử lại</Typography>
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
}
