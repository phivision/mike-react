import { ButtonBase, makeStyles } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
  },
  image: {
    position: "relative",
    height: 200,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important", // Overrides inline-style
      height: 100,
    },
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        opacity: 0.15,
      },
      "& $imageMarked": {
        opacity: 0,
      },
      "& $imageTitle": {
        border: "4px solid currentColor",
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

export default function ImageButton(image) {
  const classes = useStyles();
  return (
    <ButtonBase
      focusRipple
      onClick={image.onClick}
      key={image.title}
      className={classes.image}
      focusVisibleClassName={classes.focusVisible}
      style={{
        width: image.width,
      }}
    >
      <span
        className={classes.imageSrc}
        style={{
          backgroundImage: `url(${image.url})`,
        }}
      />
      <span className={classes.imageBackdrop} />
      <span className={classes.imageButton}>
        <PlayArrowIcon fontSize="large" />
      </span>
    </ButtonBase>
  );
}

ImageButton.propTypes = {
  width: PropTypes.string,
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
