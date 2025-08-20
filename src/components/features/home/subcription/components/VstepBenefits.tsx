import { Box, Typography, Grid, useTheme } from "@mui/material";
import { benefits } from "../utils/benefits";

type VstepBenefitsProps = {
  id: string;
};

const VstepBenefits = ({ id }: VstepBenefitsProps) => {
  const theme = useTheme();
  return (
    <Box id={id} sx={{ py: 6, px: 2 }}>
      <Typography
        variant="h5"
        align="center"
        sx={{ color: theme.palette.text.primary, fontWeight: 700, mb: 1 }}
      >
        <span role="img" aria-label="rocket">
          🚀
        </span>{" "}
        Lợi ích của các gói đem lại{" "}
        <span style={{ color: "#2c7be5" }}>
          ngay lập tức và cực kỳ hiệu quả.
        </span>
      </Typography>
      <Typography
        align="center"
        sx={{ color: theme.palette.text.primary, mb: 5, maxWidth: 900, mx: "auto", fontSize: 18 }}
      >
        Để chinh phục chứng chỉ <b>B1 - B2 - C1</b>, việc{" "}
        <b>làm quen và luyện đề thi trên phần mềm thi</b> là mấu chốt quan
        trọng. Hệ thống Luyện thi VSTEP cung cấp đầy đủ các chức năng giúp bạn
        ôn tập hiệu quả, tối ưu điểm số và cải thiện kỹ năng qua từng bài làm.
      </Typography>
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: 900, mx: "auto" }}
      >
        {benefits.map((benefit, idx) => (
          <Grid item xs={12} lg={6} key={idx}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
              <Box sx={{ fontSize: 36, mt: 0.5 }}>{benefit.icon}</Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.text.primary, fontWeight: 700 }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    mt: 0.5,
                    fontSize: 16,
                    width: { xs: "90%", lg: "100%" },
                  }}
                >
                  {benefit.description}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VstepBenefits;
