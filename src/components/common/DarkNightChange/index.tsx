import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";

type DarkNightChangeProps = {};

const DarkNightChange = (_: DarkNightChangeProps) => {
  const theme = useTheme();

  return (
    <BasicStack
      direction="row"
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={0.3}
    >
      <BasicBox>
        <BasicBox
          sx={{
            backgroundColor: grey[100],
            lineHeight: 1,
            ":hover": {
              cursor: "pointer",
              backgroundColor: grey[300],
            },
            color: theme.palette.primary.main,
            border: "1px solid #ccc",
            p: 0.8,
            borderRadius: "6px 0 0 6px",
          }}
        >
          <LightModeIcon
            sx={{
              width: 20,
              height: 20,
            }}
          />
        </BasicBox>
      </BasicBox>
      <BasicBox>
        <BasicBox
          sx={{
            backgroundColor: grey[100],
            lineHeight: 1,
            ":hover": {
              cursor: "pointer",
              color: theme.palette.primary.main,
              backgroundColor: grey[300],
            },
            border: "1px solid #ccc",
            p: 0.8,
            borderRadius: "0 6px 6px 0",
          }}
        >
          <NightlightIcon
            sx={{
              width: 20,
              height: 20,
            }}
          />
        </BasicBox>
      </BasicBox>
    </BasicStack>
  );
};

export default DarkNightChange;
