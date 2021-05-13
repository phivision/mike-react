import { createMuiTheme } from "@material-ui/core/styles";

const fonts = [
  "Nunito",
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(",");

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#F4F6FA",
      main: "#7265E3",
      dark: "#3632A8",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F3F6FB",
    },
  },
  typography: {
    fontFamily: fonts,
    body1: {
      fontWeight: 500,
      fontSize: 16,
      letterSpacing: "0.014 em",
      color: "#4C5980",
    },
    body2: {
      fontWeight: 500,
      fontSize: 14,
      letterSpacing: "0.014 em",
      color: "#9C9EB9",
    },
    h1: {
      fontWeight: 600,
      fontSize: 32,
      color: "#2D3142",
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
      color: "#2D3142",
    },
    h6: {
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: "0.167 em",
      textTransform: "uppercase",
      color: "#7265E3",
    },
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#FFFFFF",
      },
    },
  },
});

export default theme;
