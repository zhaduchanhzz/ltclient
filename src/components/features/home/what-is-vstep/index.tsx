"use client";
import BasicAccordion from "@/components/base/MaterialUI-Basic/Accordition";
import BasicAccordionDetails from "@/components/base/MaterialUI-Basic/Accordition/BasicAccordionDetails";
import BasicAccordionSummary from "@/components/base/MaterialUI-Basic/Accordition/BasicAccordionSummary";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicList from "@/components/base/MaterialUI-Basic/List";
import BasicListItem from "@/components/base/MaterialUI-Basic/List/BasicListItem";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  contentList,
  examSections,
  proficiencyLevels,
  scoreLevels,
  studyPlanData,
  targetGroups,
} from "./components/data";
import BasicNextImage from "@/components/base/MaterialUI-Basic/Image/BasicNextImage";
import { app_images } from "../../../../../public/images";
import RelateArticle from "../exam-schedule/components/RelateArticle";

type WhatIsVstepProps = {};

const WhatIsVstep = (_: WhatIsVstepProps) => {
  return (
    <BasicBox sx={{ maxWidth: 1000, mx: "auto", my: 5 }}>
      <BasicStack spacing={4}>
        <BasicStack spacing={1}>
          <BasicNextLink href={APP_ROUTE.LEARN_ABOUT_VSTEP}>
            Tìm hiểu về VSTEP
          </BasicNextLink>
          <BasicBox>
            <BasicTypography variant="h4">
              Chứng chỉ VSTEP là gì?
            </BasicTypography>
            <BasicTypography variant="h4">
              Tìm hiểu chi tiết về kỳ thi đánh giá năng lực tiếng Anh VSTEP
            </BasicTypography>
          </BasicBox>
          <BasicTypography variant="body1">
            Kỳ thi VSTEP (Vietnamese Standardized Test of English Proficiency)
            là một kỳ thi đánh giá trình độ tiếng Anh được tổ chức và quản lý
            bởi Bộ Giáo dục và Đào tạo Việt Nam. VSTEP được thiết kế để đo lường
            năng lực sử dụng tiếng Anh từ cơ bản đến nâng cao, phù hợp với nhiều
            đối tượng học viên từ sinh viên đến người đi làm. Chứng chỉ này
            không chỉ giúp người học đánh giá trình độ tiếng Anh mà còn mở ra cơ
            hội học tập và nghề nghiệp.
          </BasicTypography>
        </BasicStack>
        <BasicDivider />
        <BasicAccordion defaultExpanded={true}>
          <BasicAccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ fontWeight: "bold" }}
          >
            <BasicTypography variant="h6">Nội dung bài viết</BasicTypography>
          </BasicAccordionSummary>
          <BasicAccordionDetails>
            <BasicList>
              {contentList.map((item, index) => (
                <BasicListItem
                  key={index}
                  sx={{
                    py: 0.2,
                    color: "info.main",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {item}
                </BasicListItem>
              ))}
            </BasicList>
          </BasicAccordionDetails>
        </BasicAccordion>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Giới thiệu về kỳ thi VSTEP
          </BasicTypography>
          <BasicTypography variant="body1">
            Chứng chỉ VSTEP (Vietnamese Standardized Test of English
            Proficiency) là công cụ đánh giá trình độ tiếng Anh chính thức tại
            Việt Nam, được Bộ Giáo dục và Đào tạo cấp phép và quản lý. VSTEP sử
            dụng thang điểm chuẩn quốc tế, chia thành các cấp độ từ A1 đến C2,
            tương đương với Khung tham chiếu Ngôn ngữ chung Châu Âu (CEFR).
            Chứng chỉ này được áp dụng rộng rãi trong giáo dục, tuyển dụng và
            các hoạt động quốc tế tại Việt Nam.
          </BasicTypography>
          <BasicTypography variant="body1">
            Mục đích của chứng chỉ VSTEP không chỉ là đánh giá khả năng giao
            tiếp tiếng Anh mà còn khuyến khích việc học tiếng Anh theo một hệ
            thống chuẩn quốc gia. VSTEP giúp sinh viên, giáo viên, cán bộ, viên
            chức, và những người học tiếng Anh có công cụ để chứng minh trình độ
            của mình, từ đó mở rộng cơ hội trong việc học tập và phát triển sự
            nghiệp.
          </BasicTypography>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            VSTEP dành cho đối tượng nào?
          </BasicTypography>
          <BasicTypography variant="body1">
            Chứng chỉ VSTEP được thiết kế cho nhiều đối tượng khác nhau, bao
            gồm:
          </BasicTypography>
          <BasicList sx={{ listStyleType: "disc", pl: 5 }}>
            {targetGroups.map((item, index) => (
              <BasicListItem key={index} sx={{ display: "list-item", py: 0.2 }}>
                <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                  {item.title}:
                </BasicTypography>
                <BasicTypography component="span">
                  {" "}
                  {item.description}
                </BasicTypography>
              </BasicListItem>
            ))}
          </BasicList>
          <BasicNextLink href={APP_ROUTE.WHO_IS_VSTEP_FOR}>
            Xem chi tiết tại đây
          </BasicNextLink>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">Cấu trúc đề thi VSTEP</BasicTypography>
          <BasicTypography variant="body1">
            Kỳ thi VSTEP gồm bốn phần thi chính, mỗi phần kiểm tra một kỹ năng
            ngôn ngữ cụ thể: Nghe, Đọc, Viết và Nói. Đề thi được thiết kế để
            kiểm tra khả năng sử dụng tiếng Anh trong nhiều tình huống thực tế
            và học thuật.
          </BasicTypography>
          {examSections.map((section, index) => (
            <BasicBox key={index}>
              <BasicTypography variant="h6" sx={{ fontWeight: "bold" }}>
                {section.title}
              </BasicTypography>
              <BasicList sx={{ listStyleType: "disc", mt: 0, pl: 5 }}>
                {section.details.map((detail, index) => (
                  <BasicListItem
                    key={index}
                    sx={{ display: "list-item", py: 0.2 }}
                  >
                    <BasicTypography component="span">
                      {detail.label}:
                    </BasicTypography>
                    <BasicTypography component="span">
                      {" "}
                      {detail.value}
                    </BasicTypography>
                  </BasicListItem>
                ))}
              </BasicList>
            </BasicBox>
          ))}
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Các cấp độ trong kỳ thi VSTEP
          </BasicTypography>
          <BasicTypography variant="body1">
            Kỳ thi VSTEP đánh giá trình độ tiếng Anh từ cơ bản đến nâng cao, với
            các cấp độ như sau:
          </BasicTypography>
          <BasicList sx={{ listStyleType: "disc", pl: 5 }}>
            {proficiencyLevels.map((item, index) => (
              <BasicListItem key={index} sx={{ display: "list-item", py: 0.2 }}>
                <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                  {item.level} ({item.label}):
                </BasicTypography>{" "}
                {item.description}
              </BasicListItem>
            ))}
          </BasicList>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">Thang điểm VSTEP</BasicTypography>
          <BasicTypography variant="body1">
            Thang điểm của kỳ thi VSTEP được chia thành các mức sau:
          </BasicTypography>
          <BasicList sx={{ listStyleType: "disc", pl: 5 }}>
            {scoreLevels.map((item, index) => (
              <BasicListItem key={index} sx={{ display: "list-item", py: 0.2 }}>
                <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                  {item.score} điểm:
                </BasicTypography>{" "}
                Trình độ {item.level} ({item.label}).
              </BasicListItem>
            ))}
            <BasicListItem sx={{ display: "list-item", py: 0.2, pl: 2 }}>
              Riêng trình độ A2 thì định dạng riêng, điểm đạt là{" "}
              <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                6.5 - 10 điểm
              </BasicTypography>
              .
            </BasicListItem>
          </BasicList>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Thời hạn chứng chỉ VSTEP
          </BasicTypography>
          <BasicTypography variant="body1">
            Chứng chỉ VSTEP không có thời hạn cố định và sẽ không ghi rõ trên
            chứng chỉ. Thời hạn hiệu lực của chứng chỉ VSTEP được xác định bởi
            các cơ quan hoặc tổ chức sử dụng chứng chỉ này. Một số cơ quan yêu
            cầu chứng chỉ có giá trị trong vòng 2 năm, trong khi những cơ quan
            khác có thể coi chứng chỉ VSTEP có giá trị vĩnh viễn.
          </BasicTypography>
          <BasicNextImage
            src={app_images.chungChiVstepLaGi1}
            alt="chungChiVstepLaGi1"
          />
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Đơn vị tổ chức thi VSTEP
          </BasicTypography>
          <BasicTypography variant="body1">
            Chứng chỉ VSTEP được tổ chức và quản lý bởi Bộ Giáo dục và Đào tạo
            Việt Nam. Tuy nhiên, việc tổ chức thi cụ thể có thể được ủy quyền
            cho các đơn vị khác nhau, bao gồm:
          </BasicTypography>
          <BasicList sx={{ listStyleType: "disc", pl: 5 }}>
            <BasicListItem sx={{ display: "list-item", py: 0.2, pl: 2 }}>
              <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                Trường đại học có đào tạo chuyên ngành ngoại ngữ:
              </BasicTypography>{" "}
              Các trường đại học, cao đẳng có chuyên ngành tiếng Anh được cấp
              phép tổ chức kỳ thi VSTEP.
            </BasicListItem>
            <BasicListItem sx={{ display: "list-item", py: 0.2, pl: 2 }}>
              <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                Các trung tâm ngoại ngữ và cơ sở giáo dục khác:
              </BasicTypography>
              Các trung tâm ngoại ngữ hoặc trường cao đẳng sư phạm có thể tổ
              chức thi VSTEP cho học sinh phổ thông và sinh viên.
            </BasicListItem>
          </BasicList>
          <BasicTypography variant="body1">
            Tính đến năm 2024, Bộ Giáo dục và Đào tạo đã cấp phép cho 34 đơn vị
            tổ chức thi chứng chỉ VSTEP.
          </BasicTypography>
          <BasicTypography variant="body1">
            Xem chi tiết tại đây
          </BasicTypography>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Sau bao lâu thì nhận được kết quả thi VSTEP?
          </BasicTypography>
          <BasicTypography variant="body1">
            Kết quả thi VSTEP sẽ được công bố sau khoảng 4 đến 6 tuần kể từ ngày
            thi. Thí sinh có thể tra cứu kết quả và nhận chứng chỉ tại trung tâm
            tổ chức thi. Một số đơn vị cũng cung cấp dịch vụ gửi chứng chỉ qua
            bưu điện.
          </BasicTypography>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Cách nhận chứng chỉ VSTEP
          </BasicTypography>
          <BasicTypography variant="body1">
            Sau khi có kết quả thi, thí sinh có thể nhận chứng chỉ VSTEP bản
            cứng tại trung tâm tổ chức thi hoặc yêu cầu gửi qua đường bưu điện.
          </BasicTypography>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">
            Phương pháp ôn luyện thi VSTEP hiệu quả
          </BasicTypography>
          <BasicList sx={{ listStyleType: "disc", pl: 5 }}>
            {studyPlanData.map((item, index) => (
              <BasicListItem
                key={index}
                sx={{ display: "list-item", py: 0.2, pl: 2 }}
              >
                <BasicTypography component="span" sx={{ fontWeight: "bold" }}>
                  {item.title}:
                </BasicTypography>{" "}
                {item.content}
              </BasicListItem>
            ))}
          </BasicList>
        </BasicStack>
        <BasicStack spacing={1}>
          <BasicTypography variant="h5">Kết luận</BasicTypography>
          <BasicTypography variant="body1">
            Kỳ thi VSTEP là một bước đệm quan trọng giúp bạn đánh giá và phát
            triển kỹ năng tiếng Anh toàn diện, đáp ứng yêu cầu học tập và công
            việc trong nước. Với lộ trình ôn luyện bài bản, sử dụng tài liệu
            chuẩn và tham gia thi thử, bạn sẽ tự tin hơn khi bước vào kỳ thi và
            đạt kết quả như mong muốn.
          </BasicTypography>
        </BasicStack>
        <RelateArticle />
      </BasicStack>
    </BasicBox>
  );
};

export default WhatIsVstep;
