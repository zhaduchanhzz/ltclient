import BasicAudio from "@/components/base/MaterialUI-Basic/Audio";
import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { useTheme } from "@mui/material";
import { useRef, useState } from "react";

const AudioRecorder: React.FC = () => {
  const theme = useTheme();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isListenAgain, setIsListenAgain] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      audioChunks.current = [];
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <BasicBox>
      <BasicStack spacing={2}>
        <BasicStack direction="row" spacing={1}>
          <BasicButton
            size="small"
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              backgroundColor: isRecording
                ? theme.palette.customStyle.bsBadgeColors.danger
                : theme.palette.customStyle.bsBadgeColors.success,
            }}
          >
            {isRecording ? "Dừng thu âm" : "Thu âm"}
          </BasicButton>
          {audioURL && (
            <BasicButton
              size="small"
              onClick={() => setIsListenAgain(true)}
              sx={{
                backgroundColor: theme.palette.customStyle.bsBadgeColors.info,
              }}
            >
              Nghe lại
            </BasicButton>
          )}
        </BasicStack>
        {isListenAgain && audioURL && <BasicAudio src={audioURL} />}
      </BasicStack>
    </BasicBox>
  );
};

export default AudioRecorder;
