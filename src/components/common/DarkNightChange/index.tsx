import BasicBox from "@/components/base/MaterialUI-Basic/Box";
import BasicStack from "@/components/base/MaterialUI-Basic/Stack";
import { useTheme } from "@mui/material";
import { grey } from "@mui/material/colors";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import { useThemeContext, useThemeContextHandle } from "@/contexts/ThemeContext";

type DarkNightChangeProps = {};

const DarkNightChange = (_: DarkNightChangeProps) => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const { toggleTheme } = useThemeContextHandle();

  const handleLightMode = () => {
    if (mode !== "light") {
      toggleTheme();
    }
  };

  const handleDarkMode = () => {
    if (mode !== "dark") {
      toggleTheme();
    }
  };

  return (
    <BasicStack
      direction="row"
      sx={{
        justifyContent: "center",
        alignItems: "center",
      }}
      spacing={0}
    >
      <BasicBox>
        <BasicBox
          onClick={handleLightMode}
          sx={{
            backgroundColor: mode === "light" 
              ? theme.palette.primary.main 
              : theme.palette.mode === "dark" 
                ? theme.palette.grey[800] 
                : theme.palette.grey[200],
            lineHeight: 1,
            ":hover": {
              cursor: "pointer",
              backgroundColor: mode === "light" 
                ? theme.palette.primary.dark 
                : theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300],
            },
            color: mode === "light" 
              ? "#fff" 
              : theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.text.secondary,
            border: `1px solid ${
              mode === "light" 
                ? theme.palette.primary.main 
                : theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400]
            }`,
            p: 0.8,
            borderRadius: "6px 0 0 6px",
            transition: "all 0.3s ease",
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
          onClick={handleDarkMode}
          sx={{
            backgroundColor: mode === "dark" 
              ? theme.palette.primary.main 
              : theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[200],
            lineHeight: 1,
            ":hover": {
              cursor: "pointer",
              backgroundColor: mode === "dark" 
                ? theme.palette.primary.dark 
                : theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[300],
            },
            color: mode === "dark" 
              ? "#fff" 
              : theme.palette.mode === "dark"
                ? theme.palette.grey[400]
                : theme.palette.text.secondary,
            border: `1px solid ${
              mode === "dark" 
                ? theme.palette.primary.main 
                : theme.palette.mode === "dark"
                  ? theme.palette.grey[700]
                  : theme.palette.grey[400]
            }`,
            borderLeft: "none",
            p: 0.8,
            borderRadius: "0 6px 6px 0",
            transition: "all 0.3s ease",
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
