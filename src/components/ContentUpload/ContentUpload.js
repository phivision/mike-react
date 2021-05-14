import React, { useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import TextField from "@material-ui/core/TextField";
// amplify components
import { API, Storage, graphqlOperation } from "aws-amplify";
import { createUserContent, updateUserContent } from "graphql/mutations";
import { getUserContent } from "graphql/queries";
// resources
import empty from "assets/img/empty.jpg";
import ImageInput from "./ImageInput";
import useInterval from "../../useInterval";
import SegmentEditor from "./SegmentEditor";
import CustomDialog from "../Dialog/CustomDialog";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import Input from "@material-ui/core/Input";
// local components
import { checkS3PrefixReady, deleteVideo } from "../../utilities/VideoTools";
// the video transcoder will generate a number of files in prefix
const videoTranscodeCount = 12;

const initialVideoForm = {
  id: "",
  PrevContentName: null,
  ContentName: "",
  Description: "",
  Title: "",
  IsDemo: false,
  createdAt: "",
  Thumbnail: "",
  Segments: JSON.stringify([]),
};

// global video file handler
let videoFile;
let thumbFile;

export default function ContentUpload(props) {
  const [videoForm, setVideoForm] = React.useState(initialVideoForm);
  const [thumbURL, setThumbURL] = React.useState("");
  const [videoReady, setVideoReady] = React.useState(false);
  const [videoStatus, setVideoStatus] = React.useState("New Video");
  // uploading count down internal
  const [count, setCount] = React.useState(0);
  const [openDuplicationDialog, setOpenDuplicationDialog] = React.useState(
    false
  );
  const videoFileRef = React.useRef();
  const thumbFileRef = React.useRef();
  const thumbReader = new FileReader();

  // setup local image reader
  thumbReader.addEventListener("load", (e) => {
    setThumbURL(e.target.result);
  });

  async function videoQuery(videoID) {
    return API.graphql(graphqlOperation(getUserContent, { id: videoID }));
  }

  useEffect(() => {
    if (props.video) {
      videoQuery(props.video).then(async (d) => {
        const userData = {
          id: d.data.getUserContent.id,
          ContentName: d.data.getUserContent.ContentName,
          Description: d.data.getUserContent.Description,
          Title: d.data.getUserContent.Title,
          IsDemo: d.data.getUserContent.IsDemo,
          Thumbnail: d.data.getUserContent.Thumbnail,
          Segments: d.data.getUserContent.Segments
            ? d.data.getUserContent.Segments
            : JSON.stringify([]),
        };

        setVideoForm(userData);
        // video exists
        setVideoReady(true);
        // update thumbnail
        let thumbURLS3;
        if (userData.Thumbnail) {
          thumbURLS3 = await Storage.get(userData.Thumbnail);
        } else {
          thumbURLS3 = empty;
        }
        setThumbURL(thumbURLS3);
      });
    } else {
      setThumbURL(empty);
    }
  }, [props.user, props.video]);

  useInterval(() => {
    // Your custom logic here
    if (count > 0) {
      setCount(count - 1);
      if (videoForm.ContentName !== "" && !videoReady)
        checkS3PrefixReady(videoForm.ContentName, "output/hls/")
          .then((lists) => {
            const videoFiles = lists[0];
            const headerFiles = lists[1];
            return (
              videoFiles.length + headerFiles.length >= videoTranscodeCount + 1
            );
          })
          .then((ready) => {
            if (ready) {
              // if transcoding is ready, view the video
              setVideoReady(true);
              setVideoStatus("Video transcoding done");
              setCount(0);
            } else {
              setVideoStatus("Video transcoding in progress...");
            }
          });
    }
  }, 1000);

  async function handleThumbnailChange(e) {
    if (!e.target.files[0]) return;
    thumbFile = e.target.files[0];
    const thumbnailName = ("Thumbnail" + props.user + Date.now()).replace(
      /[^0-9a-z]/gi,
      ""
    );
    setVideoForm({ ...videoForm, Thumbnail: thumbnailName });
    // read file into local memory
    thumbReader.readAsDataURL(e.target.files[0]);
  }
  const handleVideoFileChange = (event) => {
    if (!event.target.files[0]) return;
    videoFile = event.target.files[0];
    // combine filename with owner id and remove non alphanumeric value from the string
    const fileName = videoFile.name.split(".");
    const newContentName =
      (fileName[0] + props.user + Date.now()).replace(/[^0-9a-z]/gi, "") +
      "." +
      fileName[1];
    const prevContentName = videoForm.ContentName;
    setVideoForm({
      ...videoForm,
      PrevContentName: prevContentName,
      ContentName: newContentName,
    });
  };
  const handleSegmentJSONChange = (s) => {
    setVideoForm({ ...videoForm, Segments: JSON.stringify(s) });
  };

  const handleVideoUpload = () => {
    // check video duplication
    if (props.video || videoForm.id) {
      setOpenDuplicationDialog(true);
    } else {
      uploadVideo()
        .then(async () => {
          const result = await API.graphql(
            graphqlOperation(createUserContent, {
              input: {
                CreatorID: props.user,
                ContentName: videoForm.ContentName,
                Description: videoForm.Description,
                Title: videoForm.Title,
                IsDemo: videoForm.IsDemo,
                Thumbnail: videoForm.Thumbnail,
                Segments: videoForm.Segments,
              },
            })
          );
          // updated video form with returned id and timestamp
          videoForm.id = result.data.createUserContent.id;
          videoForm.createdAt = result.data.createUserContent.createdAt;
        })
        .catch(console.log);
    }
  };

  const handleCloseDuplicationDialog = () => {
    setOpenDuplicationDialog(false);
  };

  const handleVideoUpdate = async () => {
    // try to re-upload the existing video
    setOpenDuplicationDialog(false);
    // remove existing video, then re-create the video
    if (props.video) {
      if (videoFile && thumbFile) {
        // if new video ready, delete existing video
        deleteVideo(videoForm.PrevContentName, videoForm.Thumbnail).then(
          uploadVideo
        );
      }
      // if new video is not ready, update other attributes
      // update database attributes
      API.graphql(
        graphqlOperation(updateUserContent, {
          input: {
            id: props.video,
            Description: videoForm.Description,
            Title: videoForm.Title,
            IsDemo: videoForm.IsDemo,
            Segments: videoForm.Segments,
            ContentName: videoForm.ContentName,
            Thumbnail: videoForm.Thumbnail,
          },
        })
      );
    }
  };

  async function uploadVideo() {
    if (videoFile && thumbFile) {
      // upload video on S3
      await Promise.all([
        Storage.put(videoForm.Thumbnail, thumbFile, {
          contentType: "image/*",
        }),
        Storage.put(videoForm.ContentName, videoFile, {
          contentType: "video/*",
          customPrefix: {
            public: "input/",
          },
        }),
      ])
        .then((result) => {
          console.log(result);
          // response with uploading results
          setVideoStatus(`Success uploading file: ${videoFile.name}!`);
          // waiting for video ready
          setVideoReady(false);
          // reset file input
          videoFileRef.current.value = "";
          thumbFileRef.current.value = "";
          // set count down timer for transcoding
          setCount(120);
        })
        .catch((error) => {
          const msg = "Error uploading file: " + error.message;
          console.log(error);
          setVideoStatus(msg);
        });
    } else {
      let msg = "";
      if (!videoFile) {
        msg += "The new video is not selected! ";
      }
      if (!thumbFile) {
        msg += "The thumbnail is not selected! ";
      }
      setVideoStatus(msg);
    }
  }

  const handleVideoFormChange = (event) => {
    setVideoForm({ ...videoForm, [event.target.name]: event.target.value });
  };

  const handleVideoDemoChange = (event) => {
    setVideoForm({ ...videoForm, [event.target.name]: event.target.checked });
  };

  return (
    <GridContainer>
      <GridItem xs={3}>
        <div>
          <TextField
            id="video-title"
            label="videoTitle"
            name="Title"
            value={videoForm.Title || ""}
            onChange={handleVideoFormChange}
          />
          <TextField
            id="video-description"
            label="videoDescription"
            name="Description"
            value={videoForm.Description || ""}
            onChange={handleVideoFormChange}
          />
          <Input
            type="file"
            name="Thumbnail"
            accept="image/*"
            inputRef={thumbFileRef}
            onChange={handleThumbnailChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={videoForm.IsDemo}
                onChange={handleVideoDemoChange}
                name="IsDemo"
                color="primary"
              />
            }
            label="Demo Video?"
          />
          <Button color="primary" onClick={handleVideoUpload}>
            Upload Content
          </Button>
        </div>
      </GridItem>
      <GridItem xs={6}>
        <ImageInput
          title={videoStatus}
          width="100%"
          url={thumbURL}
          accept="video/*"
          inputRef={videoFileRef}
          onChange={handleVideoFileChange}
        />
        <CustomDialog
          open={openDuplicationDialog}
          title="Video Duplication Alert"
          text="The video has already been uploaded, do you still want to upload it?"
          onClose={handleCloseDuplicationDialog}
          onClickYes={handleVideoUpdate}
          onClickNo={handleCloseDuplicationDialog}
        />
      </GridItem>
      <GridItem xs={3}>
        <SegmentEditor
          segments={videoForm.Segments}
          onChange={handleSegmentJSONChange}
        />
      </GridItem>
    </GridContainer>
  );
}

ContentUpload.propTypes = {
  user: PropTypes.string,
  video: PropTypes.string,
  onClose: PropTypes.func,
};
