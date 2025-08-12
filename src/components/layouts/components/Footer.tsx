import { Box, Container, Grid2, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { AppConfig } from "@/config/app-config";

type FooterProps = {};

const Footer = (_: FooterProps) => {
  return (
    <Box sx={{ backgroundColor: "#000" }}>
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 3 }}>
            {AppConfig.logoUrl ? (
              <Box sx={{ mb: 2 }}>
                <Image
                  src={AppConfig.logoUrl}
                  alt="Logo"
                  width={200}
                  height={60}
                  style={{
                    maxHeight: 60,
                    maxWidth: 200,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                  }}
                />
              </Box>
            ) : (
              <Typography variant="h5" sx={{ color: "#fff" }}>
                LUYỆN THI VSTEP
              </Typography>
            )}
          </Grid2>
          <Grid2 container size={{ xs: 3 }} alignItems="center">
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Chính sách
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Chính sách đổi hàng và bảo hành
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Chính sách Membership
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Chính sách ưu đãi sinh nhật
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Chính sách bảo mật
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Chính sách giao hàng
                </Typography>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 container size={{ xs: 3 }} alignItems="flex-start">
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Hỗ trợ khách hàng
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Hỗ trợ khách hàng 1
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Hỗ trợ khách hàng 2
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Hỗ trợ khách hàng 2
                </Typography>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 container size={{ xs: 3 }} alignItems="flex-start">
            <Grid2 container spacing={1}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  Cửa hàng
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Địa chỉ: {AppConfig.address}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  SĐT: {AppConfig.phone}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Email: {AppConfig.email}
                </Typography>
              </Grid2>
              <Grid2 container size={{ xs: 12 }}>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ color: "#fff" }}
                >
                  Facebook:
                </Typography>
                <Link
                  href={AppConfig.facebook.url}
                  target="_blank"
                  style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                >
                  {AppConfig.facebook.name}
                </Link>
              </Grid2>
              {AppConfig.zalo && (
                <Grid2 container size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#fff" }}
                  >
                    Zalo:
                  </Typography>
                  <Link
                    href={AppConfig.zalo.url}
                    target="_blank"
                    style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                  >
                    {AppConfig.zalo.name}
                  </Link>
                </Grid2>
              )}
              {AppConfig.telegram && (
                <Grid2 container size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#fff" }}
                  >
                    Telegram:
                  </Typography>
                  <Link
                    href={AppConfig.telegram.url}
                    target="_blank"
                    style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                  >
                    {AppConfig.telegram.name}
                  </Link>
                </Grid2>
              )}
            </Grid2>
          </Grid2>
        </Grid2>
      </Container>

      <Box sx={{ borderTop: "1px solid #545454", py: 6 }}>
        <Typography variant="body1" sx={{ color: "#fff" }} align="center">
          Copyright © 2024
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
