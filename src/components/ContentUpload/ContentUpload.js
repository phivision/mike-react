import React, { useEffect } from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import { Typography, Checkbox, FormControlLabel } from "@material-ui/core";
// core components
import {
  GridContainer,
  GridItem,
  CustomButton,
  CardStyled,
  InputField,
} from "components/StyledComponents/StyledComponents";
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
// local components
import { checkS3PrefixReady, deleteVideo } from "../../utilities/VideoTools";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { beforeImageUpload } from "../../utilities/ImagesCompress";
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
let newImage;

export default function ContentUpload(props) {
  const [videoForm, setVideoForm] = React.useState(initialVideoForm);
  const [thumbURL, setThumbURL] = React.useState("");
  const [videoReady, setVideoReady] = React.useState(false);
  const [videoStatus, setVideoStatus] = React.useState("New Video");
  const [uploadProgress, setUploadProgress] = React.useState(0);
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
          console.log(await API.Auth.currentAuthenticatedUser());
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
      } else {
        missingFileMessage();
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

  const missingFileMessage = () => {
    let msg = "";
    if (videoFile === undefined) {
      msg += "The new video is not selected! ";
    }
    if (thumbFile === undefined) {
      msg += "The thumbnail is not selected! ";
    }
    setVideoStatus(msg);
  };

  async function uploadVideo() {
    //larger than 500K will start compress
    console.log("original image size", thumbFile.size / 1024);
    if (thumbFile.size > 1024 * 1024 * 0.5) {
      newImage = await beforeImageUpload(thumbFile, 350);
      console.log("compressed size", newImage.size / 1024);
    } else {
      newImage = thumbFile;
    }
    if (videoFile !== undefined && newImage !== undefined) {
      // prepare progress bar
      setUploadProgress(1);
      // notify uploader
      setVideoStatus(`Uploading file: ${videoFile.name}!`);
      // upload video on S3
      await Promise.all([
        Storage.put(videoForm.Thumbnail, newImage, {
          contentType: "image/*",
        }),
        Storage.put(videoForm.ContentName, videoFile, {
          progressCallback(progress) {
            const currentProgress = (progress.loaded / progress.total) * 100;
            setUploadProgress(currentProgress);
            console.log(currentProgress + "%");
          },
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
          // reset progress bar
          setUploadProgress(0);
          // waiting for video ready
          setVideoReady(false);
          // reset file input
          videoFileRef.current.value = "";
          thumbFileRef.current.value = "";
          // set count down timer for transcoding
          setCount(120);
          // notify upload dialog the content is uploaded
          if (props.onUpload) {
            props.onUpload(true);
          }
        })
        .catch((error) => {
          const msg = "Error uploading file: " + error.message;
          console.log(error);
          setVideoStatus(msg);
        });
    } else {
      missingFileMessage();
    }
  }

  const handleVideoFormChange = (event) => {
    setVideoForm({ ...videoForm, [event.target.name]: event.target.value });
  };

  const handleVideoDemoChange = (event) => {
    setVideoForm({ ...videoForm, [event.target.name]: event.target.checked });
  };

  const statusCol = uploadProgress > 0 ? 3 : 12;
  return (
    <GridContainer>
      <GridItem xs={12} sm={statusCol}>
        <Typography variant="h3">{videoStatus}</Typography>
      </GridItem>
      {uploadProgress > 0 ? (
        <GridItem xs={12} sm={12 - statusCol}>
          <LinearProgressWithLabel value={uploadProgress} />
        </GridItem>
      ) : null}
      <GridContainer item xs={12} sm={3} direction="column">
        <InputField
          id="video-title"
          label="Title"
          name="Title"
          value={videoForm.Title}
          onChange={handleVideoFormChange}
        />
        <InputField
          id="video-description"
          label="Description"
          name="Description"
          value={videoForm.Description}
          onChange={handleVideoFormChange}
        />
        <CardStyled>
          <ImageInput
            title="Thumbnail"
            width="100%"
            height="120px"
            url={thumbURL}
            accept="image/*"
            inputRef={thumbFileRef}
            onChange={handleThumbnailChange}
          />
        </CardStyled>
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
        <CustomButton variant="contained" onClick={handleVideoUpload}>
          Upload Content
        </CustomButton>
      </GridContainer>
      <GridItem xs={12} sm={6}>
        <CardStyled>
          <ImageInput
            title={videoStatus}
            url=""
            width="100%"
            accept="video/*"
            inputRef={videoFileRef}
            onChange={handleVideoFileChange}
          />
        </CardStyled>
        <CustomDialog
          open={openDuplicationDialog}
          title="Video Duplication Alert"
          text="The video has already been uploaded, do you still want to upload it?"
          onClose={handleCloseDuplicationDialog}
          onClickYes={handleVideoUpdate}
          onClickNo={handleCloseDuplicationDialog}
        />
      </GridItem>
      <GridItem xs={12} sm={3}>
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
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func,
};
