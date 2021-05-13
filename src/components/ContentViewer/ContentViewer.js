import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// customize components
import ContentInfo from "./ContentInfo";
import { MemoVideoPlayer } from "./VideoPlayer";

export default function ContentViewer({ post }) {
  const segments = post.Segments ? post.Segments : JSON.stringify([]);
  return (
    <GridContainer>
      <GridItem xs={4}>
        <ContentInfo
          title={post.Title}
          desc={post.Description}
          segments={segments}
        />
      </GridItem>
      <GridItem xs={8}>
        <MemoVideoPlayer video={post.ContentName} />
      </GridItem>
    </GridContainer>
  );
}

ContentViewer.propTypes = {
  post: PropTypes.shape({
    Title: PropTypes.string,
    Description: PropTypes.string,
    Segments: PropTypes.string,
    Thumbnail: PropTypes.string,
    ContentName: PropTypes.string,
  }),
};
