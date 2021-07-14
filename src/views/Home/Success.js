import React from "react";
import { TextStyle } from "../../components/StyledComponents/StyledComponents";
import Container from "@material-ui/core/Container";
import Confetti from "react-confetti";
import Box from "@material-ui/core/Box";

const Success = () => {
  const { innerWidth: width, innerHeight: height } = window;

  return (
    <>
      <Confetti width={width} height={height} />
      <Container maxWidth="md">
        <Box m={2}>
          <TextStyle variant="h2">
            Sign up successful! We&apos;ll be in touch soon.
          </TextStyle>
        </Box>
      </Container>
    </>
  );
};

export default Success;
