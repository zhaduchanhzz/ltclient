import { APP_ROUTE } from "@/consts/app-route";

export const navLinks: { href: string; name: string }[] = [
  { name: "Thi thử", href: APP_ROUTE.EXAM_ROOM },
  { name: "Luyện đề", href: APP_ROUTE.PRACTICE_DASHBOARD },
  { name: "Gói cước", href: APP_ROUTE.SUBSCRIPTION },
  { name: "Lịch thi", href: APP_ROUTE.EXAM_SCHEDULE },
  { name: "Lịch sử thi", href: APP_ROUTE.HISTORY },
];

export const articleMenuLinks: { href: string; name: string }[] = [
  { name: "Tất cả bài viết", href: APP_ROUTE.BLOG },
  { name: "VSTEP là gì", href: APP_ROUTE.WHAT_IS_VSTEP },
  { name: "Tìm hiểu về VSTEP", href: APP_ROUTE.LEARN_ABOUT_VSTEP },
  { name: "Lịch thi VSTEP", href: APP_ROUTE.EXAM_SCHEDULE },
  { name: "Hướng dẫn thi thử VSTEP", href: APP_ROUTE.GUIDE_REGISTER_ACCOUNT },
];

export const userMenuLinks: { href: string; name: string }[] = [
  { name: "Thông tin chung", href: APP_ROUTE.USER_GENERAL },
  { name: "Lịch sử thi", href: APP_ROUTE.USER_HISTORY },
  { name: "Danh sách bài viết", href: APP_ROUTE.USER_SPEAKING },
  { name: "Danh sách bài nói", href: APP_ROUTE.USER_WRITING },
];

export const guestMenuLinks = [
  { name: "Đăng nhập", href: APP_ROUTE.LOGIN },
  { name: "Đăng ký", href: APP_ROUTE.REGISTER },
];

export const practicePageName: { href: string; name: string }[] = [
  { name: "Hệ thống ôn luyện VSTEP", href: APP_ROUTE.PRACTICE_DASHBOARD },
  // Practice
  { name: "Luyện đề nghe", href: APP_ROUTE.PRACTICE_LISTENING },
  { name: "Luyện đề đọc", href: APP_ROUTE.PRACTICE_READING },
  { name: "Luyện đề viết", href: APP_ROUTE.PRACTICE_WRITING },
  { name: "Luyện đề nói", href: APP_ROUTE.PRACTICE_SPEAKING },
  // Practice History
  { name: "Lịch sử luyện đề nghe", href: APP_ROUTE.PRACTICE_HISTORY_LISTENING },
  { name: "Lịch sử luyện đề đọc", href: APP_ROUTE.PRACTICE_HISTORY_READING },
  { name: "Lịch sử luyện đề viết", href: APP_ROUTE.PRACTICE_HISTORY_WRITING },
  { name: "Lịch sử luyện đề nói", href: APP_ROUTE.PRACTICE_HISTORY_SPEAKING },

  // Practice Review
  { name: "Xem lại bài luyện nghe", href: APP_ROUTE.PRACTICE_REVIEW_LISTENING },
  { name: "Xem lại bài luyện đọc", href: APP_ROUTE.PRACTICE_REVIEW_READING },
  { name: "Xem lại bài luyện viết", href: APP_ROUTE.PRACTICE_REVIEW_WRITING },
  { name: "Xem lại bài luyện nói", href: APP_ROUTE.PRACTICE_REVIEW_SPEAKING },
];

export const navItems = [
  { label: "Đăng ký tài khoản", path: "/register" },
  { label: "Đăng nhập tài khoản", path: "/login" },
  { label: "Cấu hình trình duyệt", path: "/config-browser" },
  { label: "Vào phòng chờ thi", path: "/waiting-room" },
  { label: "Thi Nghe", path: "/exam/listening" },
  { label: "Thi Đọc", path: "/exam/reading" },
  { label: "Thi Viết", path: "/exam/writing" },
  { label: "Thi Nói", path: "/exam/speaking" },
  { label: "Xem kết quả thi", path: "/exam/results" },
  { label: "Quản lý tài khoản", path: "/account" },
  { label: "Đăng ký chấm tự luận", path: "/grading/register" },
  { label: "Lượt chấm tự luận", path: "/grading/sessions" },
  { label: "Tài khoản VIP", path: "/vip" },
  { label: "Nhập mã khuyến mại", path: "/promo-code" },
];
