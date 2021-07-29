import React from "react";
import PropTypes from "prop-types";
// customize components
import ContentInfo from "./ContentInfo";
import { MemoVideoPlayer } from "./VideoPlayer";
import {
  GridContainer,
  GridItem,
} from "components/StyledComponents/StyledComponents";
import { Card } from "@material-ui/core";

export default function ContentViewer({ post }) {
  const segments = post.Segments ? post.Segments : JSON.stringify([]);
  const m3u8Key = post.ContentName.replace(/_/g, "");
  return (
    <GridContainer>
      <GridItem xs={12} sm={5}>
        <ContentInfo
          title={post.Title}
          desc={post.Description}
          segments={segments}
        />
      </GridItem>
      <GridItem xs={12} sm={7}>
        <Card>
          <MemoVideoPlayer video={m3u8Key} />
        </Card>
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
