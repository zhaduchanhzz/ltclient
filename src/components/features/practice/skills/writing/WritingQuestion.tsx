"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import { APP_ROUTE } from "@/consts/app-route";
import { useRouter } from "next/navigation";

type WritingQuestionProps = {};

const WritingQuestion = (_: WritingQuestionProps) => {
  const router = useRouter();
  return (
    <BasicButton onClick={() => router.push(APP_ROUTE.PRACTICE_REVIEW_WRITING)}>
      Nộp bài
    </BasicButton>
  );
};

export default WritingQuestion;
