import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { features } from "../utils/func";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { Button, Grid } from "@mui/material";

type SystemFunctionProps = {
  id: string;
};

const SystemFunction = ({ id }: SystemFunctionProps) => {
  return (
    <BasicBox
      id={id}
      sx={{
        mt: 6,
        mb: 4,
        textAlign: "center",
        width: "100%",
        px: 2,
        mx: "auto",
      }}
    >
      <BasicTypography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        🖥️ Luyện thi VSTEP đem lại cho thí sinh{" "}
        <span style={{ color: "#2c7be5" }}>rất nhiều chức năng hữu ích.</span>
      </BasicTypography>
      <BasicTypography
        variant="body1"
        sx={{ mb: 4, maxWidth: 900, mx: "auto" }}
      >
        Để chinh phục chứng chỉ <b>B1 - B2 - C1</b>, việc{" "}
        <b>làm quen và luyện đề thi trên phần mềm thi</b> là mấu chốt quan
        trọng. Hệ thống Luyện thi VSTEP cung cấp đầy đủ các chức năng giúp bạn
        ôn tập hiệu quả, tối ưu điểm số và cải thiện kỹ năng qua từng bài làm.
      </BasicTypography>
      <Grid
        container
        spacing={4}
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{ mb: 4, width: "100%", mx: "auto" }}
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Grid
              item
              xs={12}
              lg={6}
              key={feature.title}
              sx={{ display: "flex", alignItems: "flex-start" }}
            >
              <BasicStack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                sx={{ width: "100%" }}
              >
                <BasicBox
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    minWidth: 56,
                  }}
                >
                  <Icon sx={{ fontSize: 48, color: "#2c7be5" }} />
                </BasicBox>
                <BasicBox sx={{ textAlign: "left" }}>
                  <BasicTypography variant="h6" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </BasicTypography>
                  <BasicTypography variant="body2" color="text.primary">
                    {feature.description}
                  </BasicTypography>
                </BasicBox>
              </BasicStack>
            </Grid>
          );
        })}
      </Grid>
      <Button
        variant="contained"
        // color="primary"
        size="large"
        sx={{ fontWeight: 600, px: 4, bgcolor: "#FF6600" }}
      >
        🔥 Đăng ký để trải nghiệm ngay hôm nay 🔥
      </Button>
    </BasicBox>
  );
};

export default SystemFunction;
