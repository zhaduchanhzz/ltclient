import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import { feedback } from "../utils/feedback";

const Feedback = ({ id }: { id: string }) => {
  return (
    <Box sx={{ py: 8, px: 2 }} id={id}>
      <Typography
        variant="h6"
        sx={{
          color: "#3ea6ff",
          fontWeight: 700,
          mb: 1,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <RecordVoiceOverIcon
          sx={{ color: "#a259ff", fontSize: 28, mb: "-2px" }}
        />
        Phản hồi từ thí sinh đã sử dụng dịch vụ
      </Typography>
      <Typography sx={{ mb: 6, textAlign: "center", fontSize: 16 }}>
        Hàng ngàn thí sinh đã đạt <b>B1-B2-C1</b> nhờ ôn luyện cùng{" "}
        <b>gói đề thi VIP & chấm bài tự luận</b>. Hãy xem họ nói gì!
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          justifyContent: "center",
          alignItems: "stretch",
          width: "100%",
          mx: "auto",
        }}
      >
        <StudentFeedback />
      </Box>
    </Box>
  );
};

const StudentFeedback = () => {
  return (
    <>
      {feedback.map((item) => (
        <Card
          key={item.id}
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            border: "1px solid #3ea6ff",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <CardContent
            sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1 }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
            >
              <Image
                src={item.avatar}
                alt={item.name}
                width={36}
                height={36}
                style={{ borderRadius: "50%" }}
              />
              <Typography
                sx={{ color: "#2c7be5", fontWeight: 700, fontSize: 16 }}
              >
                {item.name}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.7,
              }}
            >
              {item.feedback}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default Feedback;
