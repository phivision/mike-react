import ReactHlsPlayer from "react-hls-player";
import PropTypes from "prop-types";
import React from "react";
import { getVideoEndpoint } from "../../utilities/VideoTools";

// load YAML file for video endpoints info
const videoEndpoint = getVideoEndpoint();

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
