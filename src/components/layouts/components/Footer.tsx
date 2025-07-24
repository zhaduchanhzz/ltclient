import { Box, Container, Grid2, Typography } from "@mui/material";
import Link from "next/link";
import { useGetSettingsQuery } from "@/services/apis/settings";
import { SettingsType } from "@/services/types/settings";
import Image from "next/image";

type FooterProps = {};

const Footer = (_: FooterProps) => {
  const { data: settings } = useGetSettingsQuery();
  return (
    <Box sx={{ backgroundColor: "#000" }}>
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 3 }}>
            {settings?.[SettingsType.LOGO]?.[0]?.content ? (
              <Box sx={{ mb: 2 }}>
                <Image
                  src={settings[SettingsType.LOGO][0].content}
                  alt="Logo"
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
                  Địa chỉ: Việt Trì, Phú Thọ
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  SĐT:{" "}
                  {settings?.[SettingsType.PHONE_NUMBER]?.[0]?.content ||
                    "0967.697.014"}
                </Typography>
              </Grid2>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ color: "#fff" }}>
                  Email:{" "}
                  {settings?.[SettingsType.EMAIL]?.[0]?.content ||
                    "chienzxzx33@gmail.com"}
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
                  href={
                    settings?.[SettingsType.CONTACT_FACEBOOK]?.[0]?.link ||
                    "https://www.facebook.com/duongchien1704"
                  }
                  target="_blank"
                  style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                >
                  {settings?.[SettingsType.CONTACT_FACEBOOK]?.[0]?.content ||
                    "duongchien1704"}
                </Link>
              </Grid2>
              {settings?.[SettingsType.CONTACT_ZALO]?.[0] && (
                <Grid2 container size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#fff" }}
                  >
                    Zalo:
                  </Typography>
                  <Link
                    href={settings[SettingsType.CONTACT_ZALO][0].link || "#"}
                    target="_blank"
                    style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                  >
                    {settings[SettingsType.CONTACT_ZALO][0].content}
                  </Link>
                </Grid2>
              )}
              {settings?.[SettingsType.CONTACT_TELEGRAM]?.[0] && (
                <Grid2 container size={{ xs: 12 }}>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{ color: "#fff" }}
                  >
                    Telegram:
                  </Typography>
                  <Link
                    href={
                      settings[SettingsType.CONTACT_TELEGRAM][0].link || "#"
                    }
                    target="_blank"
                    style={{ color: "#fff", padding: 0, marginLeft: 0.5 }}
                  >
                    {settings[SettingsType.CONTACT_TELEGRAM][0].content}
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
