import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import ContentViewer from "../../components/ContentViewer/ContentViewer";
import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

export default function ViewerDialog({ post, open, onClose }) {
  const body = (
    <DialogContent>
      <ContentViewer post={post} />
    </DialogContent>
  );
  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogActions>
        <IconButton onClick={onClose} color="primary">
          <CloseIcon />
        </IconButton>
      </DialogActions>
      {body}
    </Dialog>
  );
}

ViewerDialog.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    Segments: PropTypes.string,
    Thumbnail: PropTypes.string,
    ContentName: PropTypes.string,
  }),
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
