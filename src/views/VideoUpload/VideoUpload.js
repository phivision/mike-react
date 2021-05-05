import React, { useEffect } from "react";
import ReactHlsPlayer from "react-hls-player";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import ContentCard from "components/ContentCard/ContentCard.js";
import CardFooter from "components/Card/CardFooter.js";
// material ui components
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
// amplify components
import { API, Storage, graphqlOperation } from "aws-amplify";
import { listUserContents } from "graphql/queries";
import { createUserContent, deleteUserContent } from "graphql/mutations";

import PropTypes from "prop-types";

// load YAML file for video endpoints info
// TODO: try to use aws SDK to pull the info from aws server
const videoEndpoint = "https://dtl1jse5ko1yc.cloudfront.net/output/hls/";
// the video transcoder will generate a number of files in prefix
const videoTranscodeCount = 12;
const demoURL =
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8";

const initialVideoForm = {
  id: null,
  ContentName: "",
  Description: null,
  IsDemo: false,
  createdAt: "",
  Thumbnail: "",
  ThumbnailURL: "",
  segments: "No Segments",
};

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
  table: {
    minWidth: 400,
  },
  textContainer: {
    whiteSpace: "normal",
    wordWrap: "break-word",
  },
};

const useStyles = makeStyles(styles);

// global video file handler
let videoFile;

const VideoPlayer = (props) => {
  return (
    <ReactHlsPlayer
      src={props.url}
      autoPlay={false}
      controls={true}
      width="100%"
      height="auto"
    />
  );
};

VideoPlayer.propTypes = {
  url: PropTypes.string,
};

const videoPropsEqual = (prevVideo, nextVideo) => {
  return prevVideo.url === nextVideo.url;
};

const MemoVideoPlayer = React.memo(VideoPlayer, videoPropsEqual);
export default function VideoUpload(props) {
  const [videoForm, setVideoForm] = React.useState(initialVideoForm);
  const [videos, setVideos] = React.useState([]);
  const [response, setResponse] = React.useState("");
  // TODO: use a guide video to replace this dummy video for first time uploader
  const [videoURL, setVideoURL] = React.useState(demoURL);
  const [thumb, setThumb] = React.useState();
  const [open, setOpen] = React.useState(false);
  const [segments, setSegments] = React.useState([]);
  const fileRef = React.useRef();

  async function handleThumbnailChange(e) {
    if (!e.target.files[0]) return;
    setThumb(e.target.files[0]);
  }

  const handleVideoUpload = () => {
    // check video duplication
    const duplicatedVideo = videos.filter((video) => {
      return video.ContentName === videoForm.ContentName;
    })[0];
    if (duplicatedVideo) {
      setOpen(true);
    } else {
      createVideo();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseUpload = async () => {
    // try to re-upload the existing video
    setOpen(false);
    // remove existing video, then re-create the video
    const duplicatedVideo = videos.filter((video) => {
      return video.ContentName === videoForm.ContentName;
    })[0];
    deleteVideo(duplicatedVideo.id).then(() => {
      // after deletion, the previous state need to be passed to the next setState hook
      createVideo();
    });
  };

  useEffect(() => {
    fetchVideos();
  }, [props.user, videoURL]);

  async function fetchVideos() {
    const apiData = await API.graphql(
      graphqlOperation(listUserContents, {
        filter: { CreatorID: { eq: props.user } },
      })
    );
    setVideos(apiData.data.listUserContents.items);
  }

  async function createVideo() {
    if (videoForm.ContentName) {
      // upload video on S3
      await Promise.all([
        API.graphql(
          graphqlOperation(createUserContent, {
            input: {
              CreatorID: props.user,
              ContentName: videoForm.ContentName,
              Description: videoForm.Description,
              IsDemo: videoForm.IsDemo,
              Thumbnail: "Thumbnail" + videoForm.ContentName,
              Segments: JSON.stringify(segments),
            },
          })
        ),
        Storage.put("Thumbnail" + videoForm.ContentName, thumb, {
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
          // updated video form with returned id and timestamp
          videoForm.id = result[0].data.createUserContent.id;
          videoForm.createdAt = result[0].data.createUserContent.createdAt;
          // response with uploading results
          setResponse(`Success uploading file: ${videoFile.name}!`);
          setVideos((prevVideos) => {
            return [...prevVideos, videoForm];
          });
          setVideoForm(initialVideoForm);
          // reset file input
          fileRef.current.value = "";
        })
        .catch((error) => {
          const msg = "Error uploading file: " + error.message;
          console.log(error);
          setResponse(msg);
        });
    }
  }

  const deleteS3Prefix = async (videoName, prefix) => {
    await Storage.list(videoName + "/", {
      customPrefix: {
        public: prefix,
      },
    })
      .then((files) => {
        files.map((file) => {
          Storage.remove(file.key, {
            customPrefix: {
              public: prefix,
            },
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkS3PrefixReady = async (videoName, prefix) => {
    // ready true if video is ready, false if not
    return await Promise.all([
      Storage.list(videoName + "/", {
        customPrefix: {
          public: prefix,
        },
      }),
      Storage.list(videoName + ".m3u8", {
        customPrefix: {
          public: "output/hls/",
        },
      }),
    ]);
  };

  async function deleteVideo(id) {
    const newVideos = videos.filter((video) => video.id !== id);
    const deleteVideo = videos.filter((video) => video.id === id)[0];
    const deleteVideoName = deleteVideo.ContentName.split(".")[0];

    if (deleteVideo) {
      await Promise.all([
        // delete S3 storage output m3u8
        Storage.remove(deleteVideoName + ".m3u8", {
          customPrefix: {
            public: "output/hls/",
          },
        }),
        // delete S3 storage output mpd
        Storage.remove(deleteVideoName + ".mpd", {
          customPrefix: {
            public: "output/dash/",
          },
        }),
        // delete S3 storage output videos
        deleteS3Prefix(deleteVideoName, "output/hls/"),
        deleteS3Prefix(deleteVideoName, "output/dash/"),
        // delete S3 storage input video
        Storage.remove(deleteVideo.ContentName, {
          customPrefix: {
            public: "input/",
          },
        }),
        Storage.remove(deleteVideo.Thumbnail),
        // delete content from database
        API.graphql(graphqlOperation(deleteUserContent, { input: { id } })),
      ])
        .then(() => {
          setVideos(() => {
            return newVideos;
          });
        })
        .catch(console.log);
    } else {
      alert("The video to be deleted does not exist!");
    }
  }

  const handleChange = (event) => {
    setVideoForm({ ...videoForm, [event.target.name]: event.target.value });
  };

  const handleVideoChange = (event) => {
    if (!event.target.files[0]) return;
    videoFile = event.target.files[0];
    // combine filename with owner id and remove non alphanumeric value from the string
    const fileName = videoFile.name.split(".");
    const contentName =
      (fileName[0] + props.user).replace(/[^0-9a-z]/gi, "") + "." + fileName[1];
    setVideoForm({ ...videoForm, ContentName: contentName });
  };

  const handleSegmentChange = (e) => {
    let s = [...segments];
    s[e.target.dataset.id][e.target.className] = e.target.value;
    setSegments(s);
  };

  const addSegment = () => {
    setSegments([
      ...segments,
      { Name: "", Timestamp: "", Sets: "", Reps: "", RPE: "" },
    ]);
  };

  const classes = useStyles();

  return (
    <div>
      <MemoVideoPlayer url={videoURL} />
      <GridContainer>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Video Uploader</h4>
              <p className={classes.cardCategoryWhite}>
                Please review and prepare your video before uploading
              </p>
            </CardHeader>
            <CardBody profile>
              <TextField
                id="description"
                label="Video Description"
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                name="Description"
                value={videoForm.Description || ""}
                onChange={handleChange}
              />
              <Input
                type="file"
                name="ContentName"
                accept="video/*"
                inputRef={fileRef}
                onChange={handleVideoChange}
              />
              <Input
                type="file"
                name="Thumbnail"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
              <form onChange={handleSegmentChange}>
                {segments.map((value, idx) => {
                  return (
                    <div key={idx}>
                      <label>{"Movement " + (idx + 1)}</label>
                      <input
                        type="text"
                        data-id={idx}
                        id={"name" + idx}
                        value={segments[idx].name}
                        className="name"
                      />
                      <input
                        type="text"
                        data-id={idx}
                        id={"timestamp" + idx}
                        value={segments[idx].timestamp}
                        className="timestamp"
                      />
                      <input
                        type="text"
                        data-id={idx}
                        id={"sets" + idx}
                        value={segments[idx].sets}
                        className="sets"
                      />
                      <input
                        type="text"
                        data-id={idx}
                        id={"reps" + idx}
                        value={segments[idx].reps}
                        className="reps"
                      />
                      <input
                        type="text"
                        data-id={idx}
                        id={"rpe" + idx}
                        value={segments[idx].rpe}
                        className="rpe"
                      />
                    </div>
                  );
                })}
              </form>
              <Button onClick={addSegment}>Add a segment</Button>
              <Button color="primary" onClick={handleVideoUpload}>
                Upload Video
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Video Duplication Alert"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    The video has already been uploaded, do you still want to
                    upload it?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    No
                  </Button>
                  <Button onClick={handleCloseUpload} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </CardBody>
            <CardFooter>
              <h4 className={classes.cardTitle}>{response}</h4>
            </CardFooter>
          </Card>
        </GridItem>
        {videos.map((video, idx) => {
          console.log(video);
          return <ContentCard post={video} key={idx} />;
        })}
        <GridItem xs={12} sm={12} md={8}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>When Created</TableCell>
                  <TableCell>Demo?</TableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Segments</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.createdAt}>
                    <TableCell component={"th"} scope="row" type="date">
                      {video.createdAt}
                    </TableCell>
                    <TableCell>
                      <Checkbox disabled checked={video.IsDemo} />
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {video.ContentName}
                    </TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        value={video.ContentName}
                        onClick={async (e) => {
                          const videoName = e.currentTarget.value.split(".")[0];
                          checkS3PrefixReady(videoName, "output/hls/")
                            .then((lists) => {
                              const videoFiles = lists[0];
                              const headerFiles = lists[1];
                              return (
                                videoFiles.length + headerFiles.length >=
                                videoTranscodeCount + 1
                              );
                            })
                            .then((ready) => {
                              if (ready) {
                                // if transcoding is ready, view the video
                                setVideoURL(
                                  videoEndpoint + videoName + ".m3u8"
                                );
                              } else {
                                alert("Video transcoding is not ready!");
                              }
                            });
                        }}
                      >
                        View Video
                      </Button>
                    </TableCell>
                    <TableCell>{video.Description}</TableCell>
                    <TableCell>{video.Segments}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        value={video.id}
                        onClick={(e) => {
                          deleteVideo(e.currentTarget.value);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </GridItem>
      </GridContainer>
    </div>
  );
}

VideoUpload.propTypes = {
  user: PropTypes.string,
};
