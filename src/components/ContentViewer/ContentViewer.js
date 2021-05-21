import React from "react";
import PropTypes from "prop-types";
// customize components
import ContentInfo from "./ContentInfo";
import { MemoVideoPlayer } from "./VideoPlayer";
import {
  GridContainer,
  GridItem,
  CardStyled,
} from "components/StyledComponets/StyledComponets";

export default function ContentViewer({ post }) {
  const segments = post.Segments ? post.Segments : JSON.stringify([]);
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
        <CardStyled>
          <MemoVideoPlayer video={post.ContentName} />
        </CardStyled>
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
