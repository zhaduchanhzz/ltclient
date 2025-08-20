import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";
import Image from "next/image";

type IntroducePackProps = {
  id: string;
};

const IntroducePack = ({ id }: IntroducePackProps) => {
  const theme = useTheme();
  return (
    <BasicBox
      id={id}
      sx={{
        width: "100%",
        py: 6,
        px: 2,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <BasicStack
        direction={{ xs: "column", lg: "row" }}
        alignItems="center"
        justifyContent="center"
        spacing={{ xs: 4, md: 8 }}
        sx={{ width: "100%", px: 2 }}
      >
        <BasicBox
          sx={{
            flex: "1 1",
            textAlign: "left",
          }}
        >
          <BasicTypography
            variant="h4"
            sx={{
              color: theme.palette.text.primary,
              fontWeight: 700,
              mb: 1,
              textAlign: "left",
            }}
          >
            Gói đề thi VIP & chấm thi tự luận VSTEP.
          </BasicTypography>
          <BasicTypography
            variant="h4"
            sx={{
              color: "#2c7be5",
              fontWeight: 700,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Nâng điểm nhanh, đạt B1-B2-C1 dễ dàng.
          </BasicTypography>
          <BasicTypography
            variant="body1"
            sx={{
              color: theme.palette.text.primary,
              fontSize: 18,
              textAlign: "left",
            }}
          >
            Gói đề thi VIP & chấm bài VSTEP - Được tin tưởng bởi hàng ngàn thí
            sinh. Đề thi sát thực tế, chấm điểm chi tiết, giúp bạn đạt{" "}
            <span style={{ color: "#2c7be5", fontWeight: 600 }}>B1-B2-C1</span>{" "}
            dễ dàng. Học mọi lúc, mọi nơi.
          </BasicTypography>
        </BasicBox>
        <BasicBox
          sx={{
            flex: "1 1",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: 350,
            position: "relative",
            height: { xs: 260, md: 400 },
          }}
        >
          <Image
            src="/images/giao-dien-thi-vstep-tren-laptop.png"
            alt="Giao diện thi VSTEP trên laptop"
            width={600}
            height={400}
            style={{
              zIndex: 1,
              position: "relative",
              maxWidth: "90%",
              height: "auto",
            }}
            priority
          />
        </BasicBox>
      </BasicStack>
    </BasicBox>
  );
};

export default IntroducePack;
