import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";

export const MODAL_MODE = { CREATE: "CREATE", UPDATE: "UPDATE" } as const;

export const CDN_IMAGE = "http://103.157.218.82:8888";

export const FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const EXAM_SECTION = {
  LISTENING: "LISTENING",
  READING: "READING",
  WRITING: "WRITING",
  SPEAKING: "SPEAKING",
} as const;

export const APP_LOCAL_STORAGE_KEY = {
  ACCESS_TOKEN: "access_token",
  IS_AUTHENTICATED: "isAuthenticated",
};

export const SERVICES = [
  {
    title: "Phần mềm thi thử VSTEP",
    items: [
      "Làm quen với giao diện, các chức năng của phần mềm thi trên máy tính.",
      "Nắm rõ được định dạng đề thi, các bước làm bài thi.",
      "Ôn luyện không giới hạn với kho đề thi khổng lồ được cập nhật mới thường xuyên.",
      "Tương thích với mọi thiết bị: máy tính, điện thoại... Bạn có thể ôn luyện ở bất cứ đâu.",
    ],
  },
  {
    title: "Luyện đề",
    items: [
      "Luyện thi từng kỹ năng (hiện có), lời giải chi tiết, script bài nghe, mẫu bài viết, bài nói... (đang cập nhật)",
      "Ôn luyện không giới hạn với kho đề thi khổng lồ được cập nhật mới thường xuyên.",
      "Tương thích với mọi thiết bị: máy tính, điện thoại... Bạn có thể ôn luyện ở bất cứ đâu.",
    ],
  },
  {
    title: "Chấm thi VSTEP",
    items: [
      "Có ngay kết quả bài thi trắc nghiệm, tự đánh giá được năng lực hiện tại.",
      "Đăng ký chấm thi tự luận với giảng viên có nhiều năm kinh nghiệm.",
    ],
  },
  {
    title: "Các dịch vụ khác",
    items: [
      "Cung cấp toàn bộ thông tin liên quan về kỳ thi VSTEP.",
      "Cập nhật lịch thi VSTEP tại các đơn vị mới nhất, đầy đủ nhất.",
      "Tuyển sinh đầu vào, đầu ra cho các Trung tâm.",
    ],
  },
];

export const REWARDS = [
  {
    label: "LƯỢT THI",
    value: "7,191,233",
    icon: EditIcon,
  },
  {
    label: "THÍ SINH",
    value: "1,855,359",
    icon: PersonIcon,
  },
  {
    label: "ĐỐI TÁC",
    value: "35",
    icon: GroupIcon,
  },
  {
    label: "NGÂN HÀNG CÂU HỎI",
    value: "4,735",
    icon: DescriptionIcon,
  },
];

export const SOLVED_STEPS = [
  {
    text: (
      <>
        <Link
          href="/register"
          style={{
            color: "#cda274",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Đăng ký
        </Link>{" "}
        tài khoản trực tuyến
      </>
    ),
  },
  {
    text: "Hệ thống tự động cấp tài khoản thi trực tuyến ngay sau khi đăng ký, đồng thời gửi thông tin qua email",
  },
  {
    text: "Đăng nhập hệ thống, chụp hình, kiểm tra microphone và tai nghe",
  },
  {
    text: (
      <>
        Nhận đề, vào thi 04 kỹ năng theo đúng thứ tự:{" "}
        <b>Nghe (47 phút) - Đọc (60 phút) - Viết (60 phút) - Nói (12 phút)</b>
      </>
    ),
  },
  {
    text: "Bấm Nộp bài khi kết thúc cả 04 kỹ năng.",
  },
  {
    text: "Nhận ngay điểm thi và kết quả chi tiết phần thi trắc nghiệm, có thể đăng ký chấm thi tự luận",
  },
];

export const LEVELS = [
  {
    level: "Bậc 2",
    items: [
      "Giáo viên Mầm non",
      "Giáo viên Tiểu học",
      "Giáo viên THCS",
      "Thi tuyển công chức, viên chức",
    ],
  },
  {
    level: "Bậc 3",
    items: [
      "Đầu vào, đầu ra Thạc sỹ, Nghiên cứu sinh",
      "Đầu vào, đầu ra Sinh viên các trường ĐH, CĐ",
      "Thi tuyển công chức, viên chức",
    ],
  },
  {
    level: "Bậc 4",
    items: [
      "Giáo viên tiếng Anh Tiểu học",
      "Giáo viên tiếng Anh THCS",
      "Đầu vào, đầu ra Thạc sỹ, Nghiên cứu sinh",
      "Thi tuyển chuyên viên cao cấp",
    ],
  },
  {
    level: "Bậc 5",
    items: [
      "Giáo viên tiếng Anh THPT",
      "Giảng viên tiếng Anh các trường ĐH, CĐ",
      "Cán bộ chấm thi VSTEP",
    ],
  },
];
