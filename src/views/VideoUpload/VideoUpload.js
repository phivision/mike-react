import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { listUserContents } from "graphql/queries";
import { createUserContent, deleteUserContent } from "graphql/mutations";

// load YAML file for video endpoints info
// TODO: try to use aws SDK to pull the info from aws server
const videoEndpoint = "https://dtl1jse5ko1yc.cloudfront.net/output/hls/";

const initialVideoForm = {
  id: null,
  ContentName: "",
  VideoURL: "",
  Description: null,
  IsDemo: false,
  createdAt: "",
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

export default function VideoUpload(props) {
  const [videoForm, setVideoForm] = React.useState(initialVideoForm);
  const [videos, setVideos] = React.useState([]);
  const [response, setResponse] = React.useState("");
  const [videoURL, setVideoURL] = React.useState("");

  useEffect(() => {
    fetchVideos();
  }, [props.user]);

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
            },
          })
        ),
        Storage.put(videoForm.ContentName, videoFile, {
          contentType: "video/*",
          customPrefix: {
            public: "input/",
          },
        }),
      ])
        .then((result) => {
          console.log(result);
          setResponse(`Success uploading file: ${name}!`);
        })
        .then(() => {
          setVideos([...videos, videoForm]);
          setVideoForm(initialVideoForm);
        })
        .catch((error) => {
          const msg = "Error uploading file: " + error.message;
          console.log(error);
          setResponse(msg);
        });
    }
  }

  async function deleteVideo(id) {
    const newVideos = videos.filter((video) => video.id !== id);
    const deleteVideo = videos.filter((video) => video.id === id)[0];
    const deleteVideoName = deleteVideo.ContentName.split(".")[0];
    await Promise.all([
      // delete S3 storage output m3u8
      Storage.remove(deleteVideoName + ".m3u8", {
        customPrefix: {
          public: "output/hls/",
        },
      }),
      // delete S3 storage output videos
      Storage.remove(deleteVideoName, {
        customPrefix: {
          public: "output/hls/",
        },
      }),
      // delete S3 storage input video
      Storage.remove(deleteVideo.ContentName, {
        customPrefix: {
          public: "input/",
        },
      }),
      // delete content from database
      API.graphql(graphqlOperation(deleteUserContent, { input: { id } })),
    ])
      .then(() => {
        setVideos(newVideos);
      })
      .catch(console.log);
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

  const classes = useStyles();

  return (
    <div>
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
                onChange={handleVideoChange}
              />
              <Button color="primary" onClick={createVideo}>
                Upload Video
              </Button>
            </CardBody>
            <CardFooter>
              <h4 className={classes.cardTitle}>{response}</h4>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={8}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="caption table">
              <caption>{videoURL}</caption>
              <TableHead>
                <TableRow>
                  <TableCell>When Created</TableCell>
                  <TableCell>Demo?</TableCell>
                  <TableCell>File Name</TableCell>
                  <TableCell>View</TableCell>
                  <TableCell>Description</TableCell>
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
                        onClick={(e) => {
                          const videoName = e.currentTarget.value.split(".")[0];
                          setVideoURL(videoEndpoint + videoName + ".m3u8");
                        }}
                      >
                        View URL
                      </Button>
                    </TableCell>
                    <TableCell>{video.Description}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        value={video.id}
                        onClick={(e) => {
                          deleteVideo(e.target.value);
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
