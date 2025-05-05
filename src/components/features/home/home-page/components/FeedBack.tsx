import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const feedbackImages = [
  "/images/feedback-1.png",
  "/images/feedback-2.png",
  "/images/feedback-3.png",
  "/images/feedback-4.png",
  "/images/feedback-5.png",
  "/images/feedback-6.png",
  "/images/feedback-7.png",
];

const FeedBack = () => {
  return (
    <Box sx={{ width: "100%", bgcolor: "#12263f", py: 8 }}>
      <Typography
        variant="h6"
        sx={{
          color: "#cda274",
          fontWeight: 700,
          textAlign: { xs: "left", md: "center" },
          mb: 4,
        }}
      >
        Phản hồi của các bạn học viên trên cả nước về đội ngũ luyenthivstep.vn
      </Typography>
      <Box
        sx={{
          maxWidth: 1100,
          mx: "auto",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Swiper
          modules={[Navigation]}
          navigation
          loop
          spaceBetween={24}
          slidesPerView={1}
          centeredSlides
          breakpoints={{
            900: { slidesPerView: 3, centeredSlides: true },
          }}
          style={{ width: "100%", padding: "0 24px" }}
        >
          {feedbackImages.map((src, idx) => (
            <SwiperSlide
              key={idx}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                  width: { xs: 220, sm: 260, md: 320 },
                  height: { xs: 400, sm: 440, md: 520 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                }}
              >
                <Image
                  src={src}
                  alt={`Feedback ${idx + 1}`}
                  width={320}
                  height={520}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #222;
          background: #fff;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition:
            box-shadow 0.2s,
            background 0.2s;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 2rem;
          font-weight: bold;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
          background: #f5f5f5;
        }
        .swiper-button-disabled {
          opacity: 0.4;
          pointer-events: none;
        }
      `}</style>
    </Box>
  );
};

export default FeedBack;
