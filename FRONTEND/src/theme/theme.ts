import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1C237E",
      dark: "#141956",
      light: "#2E3899",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#E31E24",
      dark: "#B8181D",
      light: "#F04A4F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D4AF37",
      dark: "#B8962E",
      light: "#E0C45A",
      contrastText: "#1C237E",
    },
    background: {
      default: "#F0F2F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1F36",
      secondary: "#5A6178",
    },
    divider: "#E2E6EF",
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C237E",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: "#FFFFFF",
          fontWeight: 600,
          fontSize: "0.8125rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default theme;
