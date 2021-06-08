import React from "react";
import PropTypes from "prop-types";
import { Box, Link } from "@material-ui/core";

export const ExternalLink = ({ href, text, variant }) => {
  return (
    <Box mx="auto" p={1}>
      <Link
        variant={variant}
        target="_blank"
        rel="noopener noreferrer"
        href={href}
      >
        {text}
      </Link>
    </Box>
  );
};

ExternalLink.propTypes = {
  href: PropTypes.string,
  text: PropTypes.string,
  variant: PropTypes.string,
};
