import { createMuiTheme } from "@material-ui/core/styles";

const fonts = ["Avenir", "Arial", "sans-serif"].join(",");

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#F4F4F4",
      main: "#848484",
      dark: "#000000",
    },
    secondary: {
      main: "#FF4E00",
    },
    background: {
      default: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: fonts,
    h1: {
      fontWeight: 900,
      fontSize: 32,
      color: "#000000",
    },
    h2: {
      fontWeight: 900,
      fontSize: 18,
      color: "#000000",
    },
    h3: {
      fontWeight: 600,
      fontSize: 16,
      color: "#000000",
    },
    body1: {
      fontWeight: 500,
      fontSize: 16,
      color: "#000000",
    },
    body2: {
      fontWeight: 300,
      fontSize: 16,
      color: "#848484",
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
