import {
  container,
  whiteColor,
  primaryColor,
} from "assets/jss/material-dashboard-react.js";
import fitness from "assets/img/fitness.jpg";

const landingPageStyle = () => ({
  container: {
    ...container,
    backgroundColor: whiteColor,
    maxWidth: "none",
    paddingLeft: 0,
    paddingRight: 0,
  },
  BImage: {
    height: "40vh",
    maxWidth: "none",
    overflow: "hidden",
  },
  BannerTitle: {
    color: "#606b6c",
    fontSize: "3rem",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.4,
    textAlign: "left",
    margin: "auto 5rem",
    whiteSpace: "pre",
  },
  avatar: {
    width: "250px",
    height: "250px",
    margin: "20px auto",
    boxShadow: `-5px -5px 0 10px ${primaryColor[4]}`,
  },
  CardBox: {
    minHeight: "200px",
    maxWidth: "800px",
    backgroundColor: "#f0f8fc",
    padding: "20px",
    marginTop: "10px",
    borderRadius: "20px",
    boxShadow: `10px 0 0 0 ${primaryColor[4]}, 10px 5px 20px 20px #e4e5e6`,
  },
  profileSection: {
    backgroundColor: "white",
    margin: "2px",
  },
  CardStlye: {
    border: "none",
    background: `url(${fitness}) no-repeat center top`,
    minHeight: "300px",
    backgroundSize: "100% 100%",
    overflow: "hidden",
    backgroundPosition: "left",
    borderRadius: "20px",
    margin: "20px",
    display: "flex",
    alignItems: "flex-end",
  },
  profileCardStlye: {
    borderRight: `3px solid ${primaryColor[4]}`,
    boxShadow: "none",
    whiteSpace: "pre",
    padding: "20px",
  },
  CourseCardTitle: {
    color: "white",
    fontSize: "2rem",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    marginLeft: "20px",
  },
  courseSection: {
    padding: "20px",
  },
  profileDes: {
    fontSize: "1rem",
    whiteSpace: "pre-line",
    lineHeight: "1.5em",
    color: "#6c7076",
  },
  BioDescription: {
    fontSize: "1.5rem",
    whiteSpace: "pre-line",
    lineHeight: "1.5em",
    color: "#6c7076",
    fontWeight: 500,
    minWidth: "600px",
  },
  profileContainer: {
    padding: "30px",
  },
  input: {
    display: "none",
  },
  centerAlign: {
    margin: "20px auto",
    textAlign: "center",
  },
});

export default landingPageStyle;
