import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import ContentUpload from "../../components/ContentUpload/ContentUpload";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import CustomDialog from "../../components/Dialog/CustomDialog";

export default function UploadDialog(props) {
  const [openDialog, setOpenDialog] = React.useState(false);
  // state to control the upload notification dialog
  const [uploaded, setUploaded] = React.useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    // set the upload state as false every time open a new upload dialog
    setUploaded(false);
  }, [props.video]);

  const body = (
    <DialogContent>
      <ContentUpload
        user={props.user}
        video={props.video}
        onClose={props.onClose}
        onUpload={setUploaded}
      />
    </DialogContent>
  );

  const notice = (
    <DialogContent>
      <Typography variant="h3">
        {"Please onboard your stripe account before uploading new videos!"}
      </Typography>
    </DialogContent>
  );

  return (
    <Dialog open={props.open} fullWidth maxWidth="md">
      <DialogActions>
        {props.isVerified && !uploaded ? (
          <>
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
              onClose={handleCloseDialog}
            />
          </>
        ) : (
          <IconButton onClick={props.onClose} color="primary">
            <CloseIcon />
          </IconButton>
        )}
      </DialogActions>
      {props.isVerified ? body : notice}
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
