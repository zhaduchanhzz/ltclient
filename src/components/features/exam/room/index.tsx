"use client";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import UserInfomation from "./components/UserInfomation";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";
import BasicAudio from "@/components/base/MaterialUI-Basic/Audio";
import AudioRecorder from "@/components/common/AudioRecorder";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import { APP_ROUTE } from "@/consts/app-route";
import DarkNightChange from "@/components/common/DarkNightChange";
import { useRouter } from "next/navigation";

type ExamRoomProps = {};

const ExamRoom = (_: ExamRoomProps) => {
  const theme = useTheme();
  const router = useRouter();

  const onClickReceiveExamPaper = () => {
    router.push(APP_ROUTE.EXAM_LISTENING);
  };

  return (
    <BasicStack
      sx={{
        backgroundColor: theme.palette.background.paper,
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <BasicGrid container spacing={2} sx={{ maxWidth: 1200 }}>
        <BasicGrid size={{ xs: 12 }}>
          <UserInfomation />
        </BasicGrid>
        <BasicGrid size={{ xs: 4 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <BasicBox
                sx={{
                  backgroundColor: "#b1c2d9",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BasicTypography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  1
                </BasicTypography>
              </BasicBox>
              <BasicTypography variant="h6">CẤU TRÚC BÀI THI</BasicTypography>
            </BasicStack>
            <BasicStack spacing={0.5}>
              <BasicTypography variant="body2">
                Kỹ năng số 1: NGHE - 3 phần (47 phút)
              </BasicTypography>
              <BasicTypography variant="body2">
                Kỹ năng số 2: ĐỌC - 4 phần (60 phút)
              </BasicTypography>
              <BasicTypography variant="body2">
                Kỹ năng số 3: VIẾT - 2 phần (60 phút)
              </BasicTypography>
              <BasicTypography variant="body2">
                Kỹ năng số 4: NÓI - 3 phần (12 phút)
              </BasicTypography>
            </BasicStack>
          </BasicStack>
        </BasicGrid>
        <BasicGrid size={{ xs: 4 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <BasicBox
                sx={{
                  backgroundColor: "#b1c2d9",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BasicTypography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  2
                </BasicTypography>
              </BasicBox>
              <BasicTypography variant="h6">KIỂM TRA ÂM THANH</BasicTypography>
            </BasicStack>
            <BasicStack spacing={0.5}>
              <BasicTypography variant="body2">
                - Bước 1: Mở loa hoặc đeo tai nghe để nghe một đoạn audio bên
                dưới.
              </BasicTypography>
              <BasicAudio src="/audios/testAudio.mp3" />
              <BasicTypography variant="body2">
                - Bước 2: Để mic thu âm sát miệng.
              </BasicTypography>
              <BasicTypography variant="body2">
                - Bước 3: Nhấp vào nút &ldquo;Thu âm&ldquo; để bắt đầu thu âm.
                Sau đó, nhấp vào nút &ldquo;Nghe lại&ldquo;. Nếu không nghe được
                giọng nói của mình vui lòng kiểm tra lại cài đặt hoặc thiết bị.
              </BasicTypography>
            </BasicStack>
            <AudioRecorder />
          </BasicStack>
        </BasicGrid>
        <BasicGrid size={{ xs: 4 }}>
          <BasicStack spacing={2}>
            <BasicStack
              direction="row"
              spacing={2}
              sx={{ alignItems: "center" }}
            >
              <BasicBox
                sx={{
                  backgroundColor: "#b1c2d9",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <BasicTypography
                  sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: 1,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  3
                </BasicTypography>
              </BasicBox>
              <BasicTypography variant="h6">Lưu ý</BasicTypography>
            </BasicStack>
            <BasicStack spacing={0.5}>
              <BasicTypography variant="body2">
                - Khi hết thời gian của từng kỹ năng, hệ thống sẽ tự động chuyển
                sang kỹ năng tiếp theo. Thí sinh không thể thao tác được với kỹ
                năng đã làm trước đó.
              </BasicTypography>
              <BasicTypography variant="body2">
                - Khi hết thời gian của từng kỹ năng, hệ thống sẽ tự động chuyển
                sang kỹ năng tiếp theo. Thí sinh không thể thao tác được với kỹ
                năng đã làm trước đó.
              </BasicTypography>
            </BasicStack>
            <BasicDivider variant="fullWidth" />
            <BasicButton
              onClick={onClickReceiveExamPaper}
              sx={{
                bgcolor: theme.palette.customStyle.bsBadgeColors.success,
                color: theme.palette.text.secondary,
              }}
            >
              Nhận đề
            </BasicButton>
            <BasicTypography variant="body2" align="center">
              hoặc về trang chủ
              <BasicNextLink
                href={APP_ROUTE.HOME}
                typographyProps={{
                  sx: { color: theme.palette.customStyle.link.primary },
                }}
              >
                {" "}
                tại đây
              </BasicNextLink>
            </BasicTypography>
            <DarkNightChange />
          </BasicStack>
        </BasicGrid>
      </BasicGrid>
    </BasicStack>
  );
};

export default ExamRoom;
