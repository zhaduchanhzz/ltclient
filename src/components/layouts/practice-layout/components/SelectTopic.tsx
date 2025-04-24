import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { Divider } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SelectTopicProps = {};

const SelectTopic = (_: SelectTopicProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [listQuestion, setListQuestion] = useState();

  useEffect(() => {
    if (pathname.includes(APP_ROUTE.PRACTICE_LISTENING)) {
      console.log("PRACTICE_LISTENING calling");
      setListQuestion(listQuestion);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_READING)) {
      console.log("PRACTICE_READING calling");
      setListQuestion(listQuestion);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_WRITING)) {
      console.log("PRACTICE_WRITING calling");
      setListQuestion(listQuestion);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_SPEAKING)) {
      console.log("PRACTICE_SPEAKING calling");
      setListQuestion(listQuestion);
    }
  }, [pathname]);

  const navigateQuestionPage = (index: number) => () => {
    if (pathname.includes(APP_ROUTE.PRACTICE_LISTENING)) {
      router.push(APP_ROUTE.PRACTICE_LISTENING + "/" + index);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_READING)) {
      router.push(APP_ROUTE.PRACTICE_READING + "/" + index);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_WRITING)) {
      router.push(APP_ROUTE.PRACTICE_WRITING + "/" + index);
    }

    if (pathname.includes(APP_ROUTE.PRACTICE_SPEAKING)) {
      router.push(APP_ROUTE.PRACTICE_SPEAKING + "/" + index);
    }
  };

  return (
    <BasicGrid container size={{ xs: 12 }} spacing={2}>
      <BasicGrid size={{ xs: 12 }}>
        <BasicStack spacing={2}>
          <BasicTypography variant="body1">Chọn mã đề</BasicTypography>
          <Divider variant="fullWidth" />
        </BasicStack>
      </BasicGrid>
      <BasicGrid container spacing={1}>
        {Array.from({ length: 50 }).map((_, index) => (
          <BasicBox key={index} sx={{ display: "inline-block" }}>
            <BasicButton
              sx={{ p: 0, minWidth: 40, minHeight: 40 }}
              onClick={navigateQuestionPage(index)}
            >
              {index + 1}
            </BasicButton>
          </BasicBox>
        ))}
      </BasicGrid>
    </BasicGrid>
  );
};

export default SelectTopic;
