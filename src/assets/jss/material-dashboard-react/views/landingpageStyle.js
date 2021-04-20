import {
  container,
  whiteColor,
  // primaryColor,
} from "assets/jss/material-dashboard-react.js";

const landingPageStyle = () => ({
  container: {
    ...container,
    backgroundColor: whiteColor,
    maxWidth: "none",
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatar: {
    width: "150px",
    height: "150px",
  },
  CardBox: {
    height: "100px",
    backgroundColor: "#f0f8fc",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "20px",
  },
  profileSection: {
    backgroundColor: "white",
    margin: "2px",
  },
  CardStlye: {
    border: "none",
    boxShadow: "none",
  },
  profileCardStlye: {
    borderRight: "3px solid #bbe1f1",
    boxShadow: "none",
    whiteSpace: "pre",
  },
});

export default landingPageStyle;
