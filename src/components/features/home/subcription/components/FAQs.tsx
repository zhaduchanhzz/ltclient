import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Link,
  Typography,
} from "@mui/material";

const faqs = [
  {
    question: "Tôi cần báo lỗi thi liên hệ như thế nào?",
    answer:
      "Bạn có thể liên hệ với đội ngũ hỗ trợ qua mục Liên hệ trên website hoặc nhắn tin trực tiếp qua fanpage để được hỗ trợ nhanh nhất.",
  },
  {
    question:
      "Gói dịch vụ có được kích hoạt ngay lập tức sau khi chuyển khoản không?",
    answer:
      "Sau khi bạn chuyển khoản thành công, hệ thống sẽ tự động kích hoạt gói dịch vụ vào tài khoản của bạn trong vòng vài phút.",
  },
  {
    question: "Tôi có được lựa chọn bài cần chấm không?",
    answer:
      "Bạn hoàn toàn có thể tự chọn bài thi Writing/Speaking mà mình muốn gửi chấm trong kho đề.",
  },
  {
    question: "Tôi sẽ nhận kết quả chấm bài tự luận trong bao lâu?",
    answer:
      "Kết quả chấm bài tự luận sẽ được gửi lại cho bạn trong vòng 1-3 ngày làm việc kể từ khi gửi bài.",
  },
  {
    question: "Làm bài thi thử và luyện đề có giới hạn số lần không?",
    answer:
      "Bạn có thể làm bài thi thử và luyện đề không giới hạn số lần trong thời gian sử dụng gói.",
  },
  {
    question: "Có thể ôn luyện trên điện thoại không?",
    answer:
      "Bạn có thể ôn luyện trên mọi thiết bị: máy tính, điện thoại, máy tính bảng... chỉ cần có kết nối internet.",
  },
  {
    question: "Có chính sách hoàn tiền không?",
    answer:
      "Nếu có sự cố về dịch vụ hoặc lý do chính đáng, bạn có thể liên hệ để được xem xét hoàn tiền theo chính sách của hệ thống.",
  },
];

const FAQs = ({ id }: { id: string }) => {
  return (
    <Box id={id} sx={{ py: 8, px: 2 }}>
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
        <HelpOutlineIcon sx={{ color: "#ff3366", fontSize: 28, mb: "-2px" }} />
        Câu hỏi thường gặp
      </Typography>
      <Typography
        sx={{ color: "black", mb: 4, textAlign: "center", fontSize: 16 }}
      >
        Những thắc mắc phổ biến về <b>gói ôn luyện & chấm thi VSTEP</b> được
        giải đáp dưới đây. Nếu bạn cần thêm thông tin, hãy{" "}
        <Link
          style={{
            color: "#2c7be5",
            fontWeight: 700,
            textDecoration: "underline",
          }}
          href="https://zalo.me/0902710030"
          target="_blank"
        >
          liên hệ ngay
        </Link>{" "}
        với chúng tôi!
      </Typography>
      <Box
        sx={{
          mx: "auto",
          background: "#2c7be5",
          borderRadius: 3,
          p: 0,
          border: "1px solid #2c7be5",
        }}
      >
        {faqs.map((faq, idx) => (
          <Accordion
            key={idx}
            sx={{
              color: "black",
              boxShadow: "none",
              borderBottom:
                idx !== faqs.length - 1 ? "1px solid #2c7be5" : "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#2c7be5" }} />}
              sx={{ fontWeight: 700, fontSize: 17, color: "#2c7be5", px: 3 }}
            >
              {faq.question}
            </AccordionSummary>
            <AccordionDetails
              sx={{ color: "black", fontSize: 15, px: 3, pb: 2 }}
            >
              {faq.answer}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default FAQs;
