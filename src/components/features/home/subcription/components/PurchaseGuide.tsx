import { Box, Typography, Card, CardContent } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PaymentIcon from "@mui/icons-material/Payment";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const steps = [
  {
    number: 1,
    icon: <LoginIcon sx={{ fontSize: 28, color: "#2c7be5" }} />,
    title: "Đăng nhập vào hệ thống",
    description: (
      <>
        Truy cập trang <b>đăng nhập</b> và sử dụng tài khoản đã đăng ký để đăng
        nhập vào hệ thống ôn luyện.
      </>
    ),
  },
  {
    number: 2,
    icon: <ListAltIcon sx={{ fontSize: 28, color: "#2c7be5" }} />,
    title: "Chọn gói dịch vụ phù hợp",
    description: (
      <>
        Truy cập danh sách các <b>gói ôn luyện & chấm thi</b> trên menu và chọn
        gói phù hợp với nhu cầu của bạn. Sau đó bấm Đăng ký.
      </>
    ),
  },
  {
    number: 3,
    icon: <PaymentIcon sx={{ fontSize: 28, color: "#2c7be5" }} />,
    title: "Thanh toán nhanh chóng",
    description: (
      <>
        Hệ thống sẽ hiển thị mã QR và thông tin thanh toán theo từng đơn hàng.
        Bạn quét mã QR hoặc nhập thông tin để chuyển khoản.
      </>
    ),
  },
  {
    number: 4,
    icon: <RocketLaunchIcon sx={{ fontSize: 28, color: "#2c7be5" }} />,
    title: "Bắt đầu ôn luyện ngay",
    description: (
      <>
        Ngay sau khi chuyển khoản thành công, hệ thống sẽ tự động kích hoạt gói
        cước vào tài khoản của bạn. Bạn đã có thể ôn luyện mọi lúc, mọi nơi!
      </>
    ),
  },
];

const PurchaseGuide = ({ id }: { id: string }) => {
  return (
    <Box sx={{ py: 8, px: 2 }} id={id}>
      <Typography
        variant="h6"
        sx={{
          color: "#2c7be5",
          fontWeight: 700,
          mb: 1,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <ShoppingCartIcon sx={{ color: "#2c7be5", fontSize: 28, mb: "-2px" }} />
        Hướng dẫn mua gói ôn luyện & chấm thi VSTEP
      </Typography>
      <Typography sx={{ mb: 5, textAlign: "center", fontSize: 16 }}>
        Chỉ với <b>3 bước đơn giản</b>, bạn có thể bắt đầu ôn luyện ngay hôm
        nay!
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          mx: "auto",
        }}
      >
        {steps.map((step) => (
          <Box
            key={step.number}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 48%" },
              mb: { xs: 2, md: 0 },
              display: "flex",
            }}
          >
            <Card
              sx={{
                border: "1px solid #2c7be5",
                borderRadius: 4,
                boxShadow: 3,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "stretch",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 2,
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mt: 3,
                    mb: 1,
                    ml: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#2c7be5",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 20,
                      mr: 1,
                    }}
                  >
                    {step.number}
                  </Box>
                  {step.icon}
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#2c7be5",
                      ml: 1,
                    }}
                  >
                    {step.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.7,
                    ml: 6,
                    mb: 3,
                  }}
                >
                  {step.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PurchaseGuide;
