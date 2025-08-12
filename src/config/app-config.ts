export const AppConfig = {
  // Contact Information
  address: process.env.NEXT_PUBLIC_ADDRESS || "Việt Trì, Phú Thọ",
  phone: process.env.NEXT_PUBLIC_PHONE || "0967.697.014",
  email: process.env.NEXT_PUBLIC_EMAIL || "chienzxzx33@gmail.com",

  // Facebook
  facebook: {
    url:
      process.env.NEXT_PUBLIC_FACEBOOK_URL ||
      "https://www.facebook.com/duongchien1704",
    name: process.env.NEXT_PUBLIC_FACEBOOK_NAME || "duongchien1704",
  },

  // Optional Social Media
  zalo: process.env.NEXT_PUBLIC_ZALO_URL
    ? {
        url: process.env.NEXT_PUBLIC_ZALO_URL,
        name: process.env.NEXT_PUBLIC_ZALO_NAME || "",
      }
    : null,

  telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL
    ? {
        url: process.env.NEXT_PUBLIC_TELEGRAM_URL,
        name: process.env.NEXT_PUBLIC_TELEGRAM_NAME || "",
      }
    : null,

  // Logo
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "",

  // Feedback Images
  feedbackImages: (() => {
    const envImages = process.env.NEXT_PUBLIC_FEEDBACK_IMAGES;

    if (envImages) {
      return envImages.split(",").filter(Boolean);
    }
    
    // Default feedback images
    return [
      "/images/feedback-1.png",
      "/images/feedback-2.png",
      "/images/feedback-3.png",
      "/images/feedback-4.png",
      "/images/feedback-5.png",
      "/images/feedback-6.png",
      "/images/feedback-7.png",
    ];
  })(),
};
