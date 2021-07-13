import { createTheme } from "@material-ui/core/styles";
import { responsiveFontSizes } from "@material-ui/core";

const fonts = ["Avenir", "Arial", "sans-serif"].join(",");

let theme = createTheme({
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
    text: {
      primary: "#000000",
    },
  },
  typography: {
    fontFamily: fonts,
    h1: {
      fontWeight: 900,
      fontSize: 52,
      color: "#000000",
    },
    h2: {
      fontWeight: 900,
      fontSize: 32,
      color: "#000000",
    },
    h3: {
      fontWeight: 600,
      fontSize: 24,
      color: "#000000",
    },
    body1: {
      fontWeight: 500,
      fontSize: 20,
      color: "#848484",
    },
    body2: {
      fontWeight: 300,
      fontSize: 12,
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

theme = responsiveFontSizes(theme);

export default theme;
