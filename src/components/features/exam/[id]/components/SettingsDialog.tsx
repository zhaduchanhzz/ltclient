import {
  DarkMode,
  LightMode,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

interface SettingsDialogProps {
  open: boolean;
  fontSize: string;
  darkMode: boolean;
  onClose: () => void;
  onFontSizeChange: (fontSize: string) => void;
  onDarkModeChange: (darkMode: boolean) => void;
}

export default function SettingsDialog({
  open,
  fontSize,
  darkMode,
  onClose,
  onFontSizeChange,
  onDarkModeChange,
}: SettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Settings />
          <Typography variant="h6">Exam Settings</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Font Size
            </Typography>
            <RadioGroup
              value={fontSize}
              onChange={(e) => onFontSizeChange(e.target.value)}
              row
            >
              <FormControlLabel
                value="small"
                control={<Radio />}
                label="Small"
              />
              <FormControlLabel
                value="medium"
                control={<Radio />}
                label="Medium"
              />
              <FormControlLabel
                value="large"
                control={<Radio />}
                label="Large"
              />
            </RadioGroup>
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Appearance
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => onDarkModeChange(e.target.checked)}
                  icon={<LightMode />}
                  checkedIcon={<DarkMode />}
                />
              }
              label={darkMode ? "Dark Mode" : "Light Mode"}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}