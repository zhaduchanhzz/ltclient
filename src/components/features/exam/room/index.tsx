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
import { APP_ROUTE } from "@/consts/app-route";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTakeExamMutation } from "@/services/apis/exam";
import { useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import UserInfomation from "./components/UserInfomation";
import LocalStorage from "@/utils/local-storage";
import { APP_LOCAL_STORAGE_KEY } from "@/consts";

type ExamRoomProps = {};

const ExamRoom = (_: ExamRoomProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { userInfo } = useAuthContext();
  const { mutateAsync: takeExam } = useTakeExamMutation();

  if (!LocalStorage.get(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN)) {
    setTimeout(() => {
      router.push(APP_ROUTE.LOGIN);
    }, 3000);

    return (
      <BasicStack sx={{ height: "100vh", width: "100vw", justifyContent: "center", alignItems: "center", gap: 4 }}>
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
    if (!userInfo) {
      console.error("User not logged in");
      return;
    }

    try {
      const response = await takeExam();

      
      if (response.success) {
      console.log(response);

        console.log("Exam created successfully:", response.data);
        setTimeout(() => {
          router.push(`/exam/${response.data.termId}`);
        }, 3000);
      } else {
        console.error("Failed to create exam:", response.message);
      }
    } catch (error: any) {
      console.error("Error taking exam:", error?.response?.data?.message || error);
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
