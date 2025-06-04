import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { SERVICES } from "@/consts";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import Rewards from "./Rewards";

const OurServices = () => {
  return (
    <BasicBox
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "#12263f", py: 8 }}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: 1100, mx: "auto", mb: 6 }}
        spacing={2}
      >
        <Grid item xs={12} md={7}>
          <Typography
            variant="h5"
            sx={{
              color: "#cda274",
              fontWeight: 700,
              mb: 1,
              textAlign: { xs: "left", md: "left" },
            }}
          >
            Dịch vụ của chúng tôi
          </Typography>
          <Typography
            sx={{ color: "#bfc9da", textAlign: { xs: "left", md: "left" } }}
          >
            Được thiết kế để đem lại tối đa lợi ích cho thí sinh trong quá trình
            ôn luyện thi, tham dự kỳ thi cho đến lúc nhận chứng chỉ.
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
          }}
        >
          <Image
            src="/images/illustration-3.png"
            alt="Dịch vụ"
            width={350}
            height={220}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Grid>
      </Grid>

      {/* Listing all services */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          maxWidth: 1100,
          mx: "auto",
          p: 0,
        }}
      >
        {SERVICES.map((service) => (
          <Box
            key={service.title}
            sx={{
              flex: { xs: "1 1 100%", md: "1 1 calc(50% - 16px)" },
              minWidth: 0,
            }}
          >
            <Paper
              sx={{
                bgcolor: "#152e4d",
                borderRadius: 2,
                border: "1px solid #cda274",
                p: 3,
                height: "100%",
              }}
            >
              <Typography
                sx={{ color: "#cda274", fontWeight: 600, fontSize: 14, mb: 2 }}
              >
                {service.title}
              </Typography>
              <List sx={{ p: 0 }}>
                {service.items.map((item, itemIdx) => (
                  <ListItem
                    key={itemIdx}
                    sx={{ color: "#bfc9da", pl: 0, py: 0.2 }}
                  >
                    <ListItemIcon sx={{ color: "#cda274", minWidth: 32, p: 0 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    <BasicTypography
                      variant="body2"
                      sx={{ color: "white", fontSize: 12 }}
                    >
                      {item}
                    </BasicTypography>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Button to view all services */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
        <Link href="/subscription" passHref legacyBehavior>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "#cda274",
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
              py: 1,
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "&:hover": {
                bgcolor: "#1769aa",
                transition: "all 0.3s ease",
                transform: "translateY(-4px)",
              },
            }}
          >
            Xem chi tiết các dịch vụ
            <ArrowRightAltIcon sx={{ fontSize: 18, ml: 1 }} />
          </Button>
        </Link>
      </Box>

      <BasicBox sx={{ maxWidth: 1100, mx: "auto", textAlign: "center", mb: 6 }}>
        <Rewards />
      </BasicBox>
    </BasicBox>
  );
};

export default OurServices;
