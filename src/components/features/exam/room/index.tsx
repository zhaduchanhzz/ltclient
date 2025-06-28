"use client";
import BasicAudio from "@/components/base/MaterialUI-Basic/Audio";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicDivider from "@/components/base/MaterialUI-Basic/Divider";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicNextLink from "@/components/base/MaterialUI-Basic/Link/BasicNextLink";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import AudioRecorder from "@/components/common/AudioRecorder";
import DarkNightChange from "@/components/common/DarkNightChange";
import { APP_COOKIE_KEY } from "@/consts";
import { APP_ROUTE } from "@/consts/app-route";
import { useTakeExamMutation } from "@/services/apis/exam";
import CookieStorage from "@/utils/cookie-storage";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import UserInfomation from "./components/UserInfomation";

type ExamRoomProps = {};

const ExamRoom = (_: ExamRoomProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { mutateAsync: takeExam } = useTakeExamMutation();

  if (!CookieStorage.get(APP_COOKIE_KEY.ACCESS_TOKEN)) {
    setTimeout(() => {
      router.push(APP_ROUTE.LOGIN);
    }, 3000);

    return (
      <BasicStack
        sx={{
          height: "100vh",
          width: "100vw",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <BasicTypography variant="h3" sx={{ textAlign: "center" }}>
          Vui lòng đăng nhập để tham gia thi
        </BasicTypography>
        <BasicTypography variant="body1" sx={{ textAlign: "center" }}>
          Chúng tôi đang chuyển hướng bạn đến trang đăng nhập trong 3 giây...
        </BasicTypography>
      </BasicStack>
    );
  }

  const onClickReceiveExamPaper = async () => {
    console.log("Starting exam creation process...");

    // Check if token exists before making the call
    const token = CookieStorage.get(APP_COOKIE_KEY.ACCESS_TOKEN);

    if (!token) {
      console.error("No access token found before making request");
      router.push(APP_ROUTE.LOGIN);
      return;
    }

    try {
      console.log("Making takeExam API call...");
      const response = await takeExam();

      console.log("API response received:", response);

      if (response.success) {
        console.log("Exam created successfully:", response.data);

        // Store the exam data in localStorage with the termId
        const examStateKey = `exam_session_state_${response.data.termId}`;
        const examState = {
          session: null,
          sectionStatus: {},
          sectionStartTimes: {},
          examData: response.data,
          lastSavedAt: Date.now(),
        };

        try {
          localStorage.setItem(examStateKey, JSON.stringify(examState));
          console.log("Stored exam data for termId:", response.data.termId);
        } catch (storageError) {
          console.error("Failed to store exam data:", storageError);
        }

        // Navigate to exam page
        router.push(`/exam/${response.data.termId}`);
      } else {
        console.error("Failed to create exam:", response.message);
        alert(`Failed to create exam: ${response.message || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Error taking exam:", error);
      console.error("Error details:", {
        status: error?.response?.status,
        message: error?.response?.data?.message,
        code: error?.response?.data?.code,
        data: error?.response?.data,
      });

      // Check if token still exists after error
      const tokenAfterError = CookieStorage.get(APP_COOKIE_KEY.ACCESS_TOKEN);

      console.log("Token exists after error:", !!tokenAfterError);

      if (!tokenAfterError) {
        console.warn(
          "Token was removed during API call - redirecting to login",
        );
        router.push(APP_ROUTE.LOGIN);
      } else {
        alert(
          `Error taking exam: ${error?.response?.data?.message || error.message || "Unknown error"}`,
        );
      }
    }
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
