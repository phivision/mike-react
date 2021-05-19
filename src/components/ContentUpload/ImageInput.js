import { ButtonBase, makeStyles } from "@material-ui/core";
import { Input, Button, InputLabel } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    minWidth: 300,
    width: "100%",
    margin: "10px",
  },
  image: {
    position: "relative",
    height: 200,
    margin: "10px 0",
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
    borderRadius: "10px",
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.4,
    transition: theme.transitions.create("opacity"),
  },
}));

export default function ImageInput(image) {
  const classes = useStyles();
  return (
    <ButtonBase
      focusRipple
      key={image.title}
      className={classes.image}
      focusVisibleClassName={classes.focusVisible}
      style={{
        width: image.width,
        height: image.height,
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
        <Input
          type="file"
          id="upload-file"
          accept={image.accept}
          inputRef={image.inputRef}
          onChange={image.onChange}
          style={{ display: "none" }}
        />
        <InputLabel htmlFor="upload-file">
          <Button variant="outlined" component="span">
            Upload
          </Button>
        </InputLabel>
      </span>
    </ButtonBase>
  );
}

ImageInput.propTypes = {
  title: PropTypes.string,
  width: PropTypes.string,
  url: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  accept: PropTypes.string,
  inputRef: PropTypes.object,
};
