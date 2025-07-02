"use client";

import {
    AccessTime,
    AccountCircle,
    ArrowForward,
    CheckCircle,
    Home,
    Quiz,
    School,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Divider,
    Fade,
    Grid2,
    Paper,
    Slide,
    Stack,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(true);
  }, []);

  const features = [
    {
      icon: <Quiz sx={{ fontSize: 28 }} />,
      title: "Luyện thi không giới hạn",
      description:
        "Truy cập tất cả các đề thi VSTEP với số lượng không giới hạn",
    },
    {
      icon: <School sx={{ fontSize: 28 }} />,
      title: "Chấm bài tự động",
      description: "Hệ thống chấm bài tự động cho Writing và Speaking",
    },
    {
      icon: <AccessTime sx={{ fontSize: 28 }} />,
      title: "Học mọi lúc mọi nơi",
      description: "Truy cập 24/7 trên mọi thiết bị của bạn",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: "100vh" }}>
      <Slide direction="up" in={showContent} timeout={800}>
        <Box>
          {/* Success Header */}
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              background: "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
              color: "white",
              borderRadius: 4,
              mb: 4,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                opacity: 0.5,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                opacity: 0.3,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Fade in={showContent} timeout={1200}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 3,
                    bgcolor: "white",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <CheckCircle sx={{ fontSize: 40, color: "#4caf50" }} />
                </Avatar>
              </Fade>

              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Đăng ký thành công!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                Cảm ơn bạn đã tin tưởng và đăng ký gói VIP của chúng tôi
              </Typography>
              <Chip
                label="Gói VIP đã được kích hoạt"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: "bold",
                  px: 2,
                  py: 1,
                }}
              />
            </Box>
          </Paper>

          {/* Order Details */}
          <Fade in={showContent} timeout={1000}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Thông tin đơn hàng
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={3}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Gói đăng ký
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        Gói VIP VSTEP Premium
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Thời hạn
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        12 tháng (365 ngày)
                      </Typography>
                    </Box>
                  </Stack>
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Ngày kích hoạt
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date().toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Ngày hết hạn
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {new Date(
                          Date.now() + 365 * 24 * 60 * 60 * 1000,
                        ).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid2>
              </Grid2>
            </Paper>
          </Fade>

          {/* Features */}
          <Fade in={showContent} timeout={1200}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Quyền lợi của bạn
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid2 container spacing={3}>
                {features.map((feature, index) => (
                  <Grid2 key={index} size={{ xs: 12, md: 4 }}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        textAlign: "center",
                        height: "100%",
                        background:
                          "linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%)",
                        border: "1px solid",
                        borderColor: "primary.100",
                        borderRadius: 3,
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          mx: "auto",
                          mb: 2,
                          bgcolor: "primary.main",
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="black">
                        {feature.description}
                      </Typography>
                    </Card>
                  </Grid2>
                ))}
              </Grid2>
            </Paper>
          </Fade>

          {/* Next Steps */}
          <Fade in={showContent} timeout={1400}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                Bước tiếp theo
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Stack spacing={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      1
                    </Typography>
                  </Avatar>
                  <Typography variant="body1">
                    Truy cập vào <strong>Tài khoản của tôi</strong> để xem thông
                    tin gói VIP
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      2
                    </Typography>
                  </Avatar>
                  <Typography variant="body1">
                    Bắt đầu luyện thi với <strong>các đề thi VIP</strong> không
                    giới hạn
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    <Typography variant="body2" fontWeight="bold">
                      3
                    </Typography>
                  </Avatar>
                  <Typography variant="body1">
                    Sử dụng tính năng <strong>chấm bài tự động</strong> cho
                    Writing và Speaking
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Fade>

          {/* Action Buttons */}
          <Fade in={showContent} timeout={1600}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Sẵn sàng bắt đầu hành trình luyện thi của bạn?
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Quiz />}
                  endIcon={<ArrowForward />}
                  onClick={() => router.push("/practice")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                    background:
                      "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                    },
                  }}
                >
                  Bắt đầu luyện thi
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<AccountCircle />}
                  onClick={() => router.push("/user/general")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Tài khoản của tôi
                </Button>
                <Button
                  variant="text"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => router.push("/")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Về trang chủ
                </Button>
              </Stack>
            </Paper>
          </Fade>
        </Box>
      </Slide>
    </Container>
  );
}
