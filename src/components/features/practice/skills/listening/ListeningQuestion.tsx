"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import { APP_ROUTE } from "@/consts/app-route";
import { useRouter } from "next/navigation";

type ListeningQuestionProps = {};

const ListeningQuestion = (_: ListeningQuestionProps) => {
  const router = useRouter();
  return (
    <BasicButton
      onClick={() => router.push(APP_ROUTE.PRACTICE_REVIEW_LISTENING)}
    >
      Nộp bài
    </BasicButton>
  );
};

export default ListeningQuestion;
