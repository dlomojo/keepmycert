import { createTheme } from "@mui/material/styles";
import colors from "./colors";
import typography from "./typography";
import shadows from "./shadows";

export default createTheme({
  palette: {
    ...colors,
    primary: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff"
    },
    secondary: {
      main: "#3f51b5",
      light: "#7986cb",
      dark: "#303f9f",
      contrastText: "#fff"
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff"
    }
  },
  typography,
  shadows,
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)"
        }
      }
    }
  }
});