import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicContainer from "@/components/base/MaterialUI-Basic/Container";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";

export default function NotFound() {
  return (
    <BasicBox
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BasicContainer maxWidth="sm">
        <BasicBox
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 3,
            p: 6,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          <BasicStack spacing={3} alignItems="center">
            <BasicTypography
              variant="h1"
              sx={{
                fontSize: "6rem",
                fontWeight: 700,
                color: "primary.main",
                lineHeight: 1,
              }}
            >
              404
            </BasicTypography>
            
            <BasicTypography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              Bài viết không tìm thấy
            </BasicTypography>
            
            <BasicTypography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: "400px",
              }}
            >
              Bài viết bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không khả dụng.
            </BasicTypography>

            <BasicStack direction="row" spacing={2} sx={{ mt: 2 }}>
              <BasicButton
                component={BasicNextLink}
                href="/vstep-article"
                variant="contained"
                color="primary"
                size="large"
              >
                Xem tất cả bài viết
              </BasicButton>
              
              <BasicButton
                component={BasicNextLink}
                href="/"
                variant="outlined"
                color="primary"
                size="large"
              >
                Về trang chủ
              </BasicButton>
            </BasicStack>
          </BasicStack>
        </BasicBox>
      </BasicContainer>
    </BasicBox>
  );
}