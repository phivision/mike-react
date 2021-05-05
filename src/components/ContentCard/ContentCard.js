import React from "react";
import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Link,
} from "@material-ui/core";
// import { FavoriteBorderIcon } from "@material-ui/icons";

export default function ContentCard({ ...props }) {
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="h3">{props.post.Description}</Typography>
        </CardContent>
        {/*<Button>/!*<FavoriteBorderIcon />*!/</Button>*/}
        {() => {
          if (props.editCallback) {
            return (
              <Link
                variant="h2"
                onClick={(e) => {
                  e.preventDefault();
                  props.editCallback();
                }}
              >
                Edit
              </Link>
            );
          }
        }}
      </CardActionArea>
    </Card>
  );
}

ContentCard.propTypes = {
  post: PropTypes.shape({
    Description: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }),
  editCallback: PropTypes.func,
};
