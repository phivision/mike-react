import React from "react";
import PropTypes from "prop-types";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CustomDialog from "../../components/Dialog/CustomDialog";

export default function UploadDialog(props) {
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const body = (
    <DialogContent>
      <ContentUpload
        user={props.user}
        video={props.video}
        onClose={props.onClose}
      />
    </DialogContent>
  );
  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogActions>
        <IconButton onClick={handleOpenDialog} color="primary">
          <CloseIcon />
        </IconButton>
        <CustomDialog
          open={openDialog}
          title="Close Content Uploading"
          text="If the video is not uploaded, unsaved data may be lost, do you want to discard it?"
          onClickYes={() => {
            handleCloseDialog();
            props.onClose();
          }}
          onClickNo={handleCloseDialog}
        />
      </DialogActions>
      {body}
    </Dialog>
  );
}

UploadDialog.propTypes = {
  user: PropTypes.string,
  open: PropTypes.bool,
  video: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  isVerified: PropTypes.bool,
};
