import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicGrid from "@/components/base/MaterialUI-Basic/Grid";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { APP_ROUTE } from "@/consts/app-route";
import { Divider } from "@mui/material";
import { useRouter } from "next/navigation";

type SelectSkillProps = {};

const SelectSkill = (_: SelectSkillProps) => {
  const router = useRouter();

  return (
    <BasicBox sx={{ maxHeight: 300, width: 1 }}>
      <BasicGrid container size={12} spacing={2}>
        <BasicGrid size={{ xs: 12 }}>
          <BasicStack spacing={2}>
            <BasicTypography variant="body1">
              Chọn kỹ năng luyện đề
            </BasicTypography>

            <Divider variant="fullWidth" />
          </BasicStack>
        </BasicGrid>
        <BasicGrid container size={{ xs: 12 }} spacing={1}>
          <BasicGrid size={{ xs: 12 }}>
            <BasicButton
              fullWidth
              onClick={() => router.push(APP_ROUTE.PRACTICE_LISTENING)}
            >
              Nghe
            </BasicButton>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <BasicButton
              fullWidth
              onClick={() => router.push(APP_ROUTE.PRACTICE_READING)}
            >
              Đọc
            </BasicButton>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <BasicButton
              fullWidth
              onClick={() => router.push(APP_ROUTE.PRACTICE_WRITING)}
            >
              Viết
            </BasicButton>
          </BasicGrid>
          <BasicGrid size={{ xs: 12 }}>
            <BasicButton
              fullWidth
              onClick={() => router.push(APP_ROUTE.PRACTICE_SPEAKING)}
            >
              Nói
            </BasicButton>
          </BasicGrid>
        </BasicGrid>
      </BasicGrid>
    </BasicBox>
  );
};

export default SelectSkill;
