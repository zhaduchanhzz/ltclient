import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicTypography from "@/components/base/MaterialUI-Basic/Typography";
import { useTheme } from "@mui/material";

type PartButtonProps = {
  onClick: () => void;
  text: string;
  isCurrentSection: boolean;
  isCurrentTab: boolean;
};

const PartButton = (props: PartButtonProps) => {
  const { onClick, text, isCurrentSection, isCurrentTab } = props;
  const theme = useTheme();

  return (
    <BasicBox
      sx={{
        backgroundColor: isCurrentTab
          ? theme.palette.info.main
          : theme.palette.background.paper,
        borderRadius: 1,
        border: `1px solid ${theme.palette.info.main}`,
        px: 1.5,
        py: 0.2,
        display: "flex",
        alignItems: "center",
        cursor: isCurrentSection ? "pointer" : "default",
      }}
      onClick={isCurrentSection ? onClick : undefined}
    >
      <BasicTypography
        variant="caption"
        sx={{
          color: isCurrentTab
            ? theme.palette.text.secondary
            : theme.palette.info.main,
        }}
      >
        {text}
      </BasicTypography>
    </BasicBox>
  );
};

export default PartButton;
