import fitness from "assets/img/fitness.jpg";

const mikeIntroStyle = {
  FitnessImage: {
    background: `url(${fitness}) no-repeat center top`,
    backgroundSize: "100% 100%",
    maxWidth: "none",
    minHeight: "490px",
    overflow: "hidden",
    backgroundPosition: "right",
  },
  MikeIntroSection: {
    backgroundColor: "white",
    maxWidth: "none",
  },
  Miketitle: {
    fontWeight: 600,
    color: "#47576a",
    fontFamily: "Futura",
  },
  MikeText: {
    color: "#6a6c6d",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    lineHeight: 1.6,
    padding: "0 10% 3% 10%",
  },
  DevAtHome: {
    backgroundColor: "#5dcbcb",
    margin: "30px 0",
    padding: "10px",
  },
  DevAtHomeTitle: {
    color: "white",
    fontWeight: 500,
    fontFamily: "Arial Rounded MT Bold",
    padding: "10%",
    lineHeight: 1.4,
    textAlign: "center",
  },
};

export default mikeIntroStyle;
