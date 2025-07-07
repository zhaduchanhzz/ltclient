"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { subscriptionPackages } from "../utils/serv";

type ServcesPackageProps = {
  id: string;
};

const ServcesPackage = ({ id }: ServcesPackageProps) => {
  const handleScrollToPriceList = () => {
    const el = document.getElementById("gia-goi-dich-vu-vstep");

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 6 }} id={id}>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: "black", fontWeight: 700, mb: 2 }}
      >
        <span role="img" aria-label="star">
          🌟
        </span>{" "}
        Các gói hỗ trợ thí sinh về{" "}
        <span style={{ color: "#2c7be5" }}>đề thi VIP & chấm bài tự luận</span>.
      </Typography>
      <Typography
        align="center"
        sx={{ color: "black", mb: 4, maxWidth: 700, mx: "auto" }}
      >
        Chọn gói phù hợp để tối ưu điểm số và đạt <b>B1-B2-C1</b> dễ dàng. Đề
        thi chuẩn định dạng VSTEP, chấm điểm chi tiết, phản hồi từ giám khảo có
        kinh nghiệm, có chứng chỉ chấm thi của Bộ.
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          justifyContent: "center",
          gap: 3,
          flexWrap: "wrap",
          mb: 6,
        }}
      >
        {subscriptionPackages.map((pkg, idx) => (
          <Card
            key={pkg.title}
            sx={{
              background: "transparent",
              color: "black",
              border: "2px solid #2c7be5",
              flex: "1 1",
              p: 2,
              boxShadow: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              <Typography
                variant="h6"
                align="center"
                sx={{ fontWeight: 700, mb: 2, color: "#2c7be5" }}
              >
                {pkg.title}
              </Typography>
              <List dense>
                {pkg.features.map((feature, i) => (
                  <ListItem key={i} sx={{ color: "black" }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon sx={{ color: "#2c7be5" }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontWeight: 700, color: "#2c7be5" }}>
                  Dành cho ai?
                </Typography>
                <List dense>
                  {pkg.target.map((t, i) => (
                    <ListItem key={i} sx={{ color: "black" }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <FiberManualRecordIcon
                          sx={{ color: "#2c7be5", fontSize: 12 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <span
                            dangerouslySetInnerHTML={{
                              __html: t.replace(
                                /(Thí sinh tự học|Người thi lại VSTEP|Writing & Speaking|trước khi thi thật|4 kỹ năng|điểm mạnh & điểm yếu)/g,
                                "<i>$1</i>",
                              ),
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
            <Button
              fullWidth
              variant={idx === 2 ? "contained" : "outlined"}
              sx={{
                mt: "auto",
                background: idx === 2 ? "#2979ff" : "transparent",
                color: idx === 2 ? "#fff" : "#ff9100",
                borderColor: "#ff9100",
                fontWeight: 700,
                borderRadius: 2,
                py: 1,
                fontSize: 14,
                "&:hover": {
                  background: idx === 2 ? "#1565c0" : "#ff9100",
                  color: "#fff",
                },
              }}
              onClick={handleScrollToPriceList}
            >
              {pkg.button}
            </Button>
          </Card>
        ))}
      </Box>
      <Box
        sx={{
          borderRadius: 3,
          width: "100%",
          mx: "auto",
          p: 4,
          textAlign: "center",
          border: "1px dashed #2c7be5",
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 1 }}>
          Thí sinh cần hỏi thêm về các gói cước?
        </Typography>
        <Typography sx={{ color: "#b0bed9", mb: 2 }}>
          Thí sinh cần thêm thông tin hoặc chưa rõ về mục nào, hãy nhắn tin trực
          tiếp cho Luyện thi VSTEP để được giải đáp mọi thắc mắc liên quan.
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: "#2c7be5",
            borderColor: "#2c7be5",
            "&:hover": { bgcolor: "#2c7be5", color: "white" },
          }}
          onClick={() => {
            window.open("https://zalo.me/0902710030", "_blank");
          }}
        >
          Nhắn tin cho chúng tôi
        </Button>
      </Box>
    </Box>
  );
};

export default ServcesPackage;
