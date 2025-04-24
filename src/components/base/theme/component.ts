import { Components, Theme } from "@mui/material/styles";
import type {} from "@mui/lab/themeAugmentation";
import type {} from "@mui/x-date-pickers/themeAugmentation";

export const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    styleOverrides: {
      "@global": {
        html: {
          fontSize: "16px", // Set the root font size
        },
      },
    },
  },
  MuiButton: {
    defaultProps: {
      size: "medium",
      variant: "contained",
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 6,
      },
    },
  },

  MuiLoadingButton: {
    defaultProps: {
      variant: "contained",
      size: "medium",
    },
    styleOverrides: {
      root: {
        textTransform: "none",
        borderRadius: 8,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      size: "medium",
      fullWidth: true,
      variant: "outlined",
    },
    styleOverrides: {
      root: {
        ["& .MuiOutlinedInput-root"]: {
          borderRadius: 8,
        },
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      size: "small",
      fullWidth: true,
    },
  },
  MuiCheckbox: {
    defaultProps: {
      size: "small",
      color: "primary",
    },
    styleOverrides: {
      root: {
        borderRadius: 4,
        padding: 0,
      },
    },
  },
  MuiChip: {
    defaultProps: {
      size: "small",
    },
    styleOverrides: {
      root: {
        fontWeight: 500,
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: "hover",
    },
  },
  MuiTable: {
    defaultProps: {
      size: "medium",
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: "6px 8px",
      },
    },
  },
  MuiIcon: {
    defaultProps: {
      fontSize: "medium",
    },
  },
  MuiSvgIcon: {
    defaultProps: {
      fontSize: "medium",
    },
  },
  MuiAlert: {
    defaultProps: {
      variant: "filled",
    },
    styleOverrides: {
      root: {
        borderRadius: 6,
      },
      message: {
        color: "#FFF",
      },
      icon: {
        color: "#FFF",
        alignItems: "center",
      },
    },
  },
  MuiSnackbar: {
    defaultProps: {
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "left",
      },
    },
  },
  MuiStack: {
    defaultProps: {
      direction: "column",
    },
  },
  MuiTypography: {
    styleOverrides: {
      root: {
        lineHeight: 1.5,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 6,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 6,
      },
    },
  },
};
