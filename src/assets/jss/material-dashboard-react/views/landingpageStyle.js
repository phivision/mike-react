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
  BImage: {
    background: `url(${"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2620721125,1355879679&fm=26&gp=0.jpg"})`,
    backgroundSize: "100% 100%",
    height: "40vh",
    maxWidth: "none",
    overflow: "hidden",
    backgroundPosition: "left",
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
    boxShadow: "-5px -5px 0 10px #5dcbcb",
  },
  CardBox: {
    minHeight: "200px",
    backgroundColor: "#f0f8fc",
    padding: "20px",
    marginTop: "10px",
    borderRadius: "20px",
    boxShadow: "10px 0 0 0 #5dcbcb, 10px 5px 20px 20px #e4e5e6",
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
    padding: "20px",
  },
  courseSection: {
    padding: "20px",
  },
});

export default landingPageStyle;
