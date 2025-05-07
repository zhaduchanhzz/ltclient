import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import ExamScheduleNationWide from "./components/ExamScheduleNationWide";
import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import { app_images } from "../../../../../public/images";
import LicenseOrganization from "./components/LicenseOrganization";
import RelateArticle from "./components/RelateArticle";
import ExamScheduleCurrentMonth from "./components/ExamScheduleCurrentMonth";
import ExamScheduleNextMonth from "./components/ExamScheduleNextMonth";

type ExamScheduleProps = {};

const ExamSchedule = (_: ExamScheduleProps) => {
  return (
    <BasicBox sx={{ maxWidth: 1200, mx: "auto" }}>
      <BasicStack spacing={8} sx={{ my: 5 }}>
        <BasicStack
          sx={{ justifyContent: "center", alignItems: "center" }}
          spacing={1}
        >
          <BasicTypography variant="h4">
            Lịch thi VSTEP năm 2025 cập nhật mới nhất và chính xác nhất
          </BasicTypography>
          <BasicTypography variant="body2">
            Cung cấp lịch thi chứng chỉ tiếng Anh VSTEP năm 2025 chính xác và
            đầy đủ của tất cả các đơn vị tổ chức thi trên cả nước, quy trình
            đăng ký thi và các thông tin liên quan. Luôn cập nhật thường xuyên
            để bạn chuẩn bị sẵn sàng cho mọi kỳ thi sắp tới.
          </BasicTypography>
        </BasicStack>
        <ExamScheduleNationWide />
        <ExamScheduleCurrentMonth />
        <ExamScheduleNextMonth />
        <BasicStack sx={{ alignItems: "center" }}>
          <BasicNextImage src={app_images.lichThiVstep} alt="lichThiVstep" />
        </BasicStack>
        <LicenseOrganization />
        <RelateArticle />
      </BasicStack>
    </BasicBox>
  );
};

export default ExamSchedule;
