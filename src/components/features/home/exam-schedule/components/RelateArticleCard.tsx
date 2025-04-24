"use client";
import BasicButton from "@/components/base/MaterialUI-Basic/Button";
import BasicCardActions from "@/components/base/MaterialUI-Basic/Card/BasicCardActions";
import BasicCardContent from "@/components/base/MaterialUI-Basic/Card/BasicCardContent";
import BasicCard from "@/components/base/MaterialUI-Basic/Card/Index";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";

type ArticleCardProps = {
  item: {
    id: number;
    title: string;
    description: string;
    link: string;
  };
};

const RelateArticleCard = (props: ArticleCardProps) => {
  const { item } = props;
  const theme = useTheme();

  return (
    <BasicCard sx={{ p: 3, minHeight: 350 }}>
      <BasicCardContent>
        <BasicStack spacing={2}>
          <BasicTypography
            variant="body1"
            align="center"
            sx={{ color: theme.palette.customStyle.link.primary }}
          >
            {item.title}
          </BasicTypography>
          <BasicTypography variant="body2" align="center" component="div">
            {item.description}
          </BasicTypography>
        </BasicStack>
      </BasicCardContent>
      <BasicCardActions sx={{ justifyContent: "center" }}>
        <BasicButton variant="outlined" size="small" color="info">
          <BasicTypography variant="body2">Xem thêm</BasicTypography>
        </BasicButton>
      </BasicCardActions>
    </BasicCard>
  );
};

export default RelateArticleCard;
