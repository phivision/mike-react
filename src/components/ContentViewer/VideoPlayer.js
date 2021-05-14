import ReactHlsPlayer from "react-hls-player";
import PropTypes from "prop-types";
import React from "react";

// load YAML file for video endpoints info
// TODO: try to use aws SDK to pull the info from aws server
const videoEndpoint = "https://dtl1jse5ko1yc.cloudfront.net/output/hls/";

const VideoPlayer = (props) => {
  const videoName = props.video.split(".")[0];
  return (
    <ReactHlsPlayer
      src={videoEndpoint + videoName + ".m3u8"}
      autoPlay={false}
      controls={true}
      width="100%"
      height="auto"
    />
  );
};

VideoPlayer.propTypes = {
  video: PropTypes.string,
};

const videoPropsEqual = (prevVideo, nextVideo) => {
  return prevVideo.video === nextVideo.video;
};

export const MemoVideoPlayer = React.memo(VideoPlayer, videoPropsEqual);
