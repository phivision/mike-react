import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listUserProfiles } from "graphql/queries";
import {
  CustomBanner,
  CustomContainer,
  InputField,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";
import SendIcon from "@material-ui/icons/Send";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import { Snackbar } from "@material-ui/core";

export default function Home() {
  const [trainers, setTrainers] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  async function trainerQuery() {
    const trainerList = await API.graphql({
      query: listUserProfiles,
      variables: { filter: { UserRole: { contains: "trainer" } } },
      authMode: "AWS_IAM",
    });
    if (trainerList.data.listUserProfiles.items != null) {
      return trainerList.data.listUserProfiles.items;
    }
  }

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const onClick = () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        email: email,
      },
      response: true,
    };
    API.post("marketing", "/marketing", myInit)
      .then(() => {
        setEmail("");
        setSnackbarMessage("Successfully signed up. We'll reach out soon!");
        setOpenSnackbar(true);
      })
      .catch(console.log);
  };

  useEffect(() => {
    trainerQuery()
      .then((r) => setTrainers(r))
      .catch(console.log);
  }, [trainers.length]);

  return (
    <>
      <CustomBanner>
        <CustomContainer
          style={{
            marginTop: "0px",
            paddingTop: "144px",
            paddingBottom: "144px",
            paddingLeft: "72px",
          }}
        >
          <TextStyle
            variant="h1"
            color="primary"
            style={{ paddingBottom: "64px" }}
          >
            Monetize your audience + expertise.
          </TextStyle>
          <TextStyle variant="h3">
            Get in touch to start growing a brand online.
          </TextStyle>
          <Grid
            container
            alignItems="center"
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <InputField label="Your email" value={email} onChange={onChange} />
            <IconButton onClick={onClick}>
              <SendIcon color="primary" disableRipple fontSize="large" />
            </IconButton>
          </Grid>
        </CustomContainer>
      </CustomBanner>
      <div style={{ padding: "30px" }}>
        <CustomContainer>
          <TextStyle variant="h2" color="primary">
            {"What's Motion?"}
          </TextStyle>
          <TextStyle variant="h3" color="secondary">
            {
              "On Motion, you can offer exclusive fitness content and personalized feedback to your audience or clients in return for a monthly subscription. We put the power in your hands to make money off the content that you want to produce at the rate that you set. Don't throw away your time and content by posting it to social media for free."
            }
          </TextStyle>
        </CustomContainer>
        <CustomContainer>
          <TextStyle variant="h2" color="primary">
            Reach more people and spend less time teaching.
          </TextStyle>
          <TextStyle variant="h3" color="secondary">
            Your knowledge and expertise is valuable. Our platform allows you to
            monetize it without having to be on your feet all day or finding a
            physical court or gym to train at. We work with you by providing the
            tools and training for you to succeed.
          </TextStyle>
        </CustomContainer>
        <CustomContainer>
          <TextStyle variant="h2" color="primary">
            Develop a recurring monthly income stream.
          </TextStyle>
          <TextStyle variant="h3" color="secondary">
            Tired of losing clients due to factors out of your control? Our
            online platform allows you to keep clients with more flexibility
            with consistent monthly subscriptions.
          </TextStyle>
        </CustomContainer>
        <CustomContainer>
          <TextStyle variant="h2" color="primary">
            Build connections with your clients online.
          </TextStyle>
          <TextStyle variant="h3" color="secondary">
            No ads, no algorithms. Develop deeper relationships with frequent
            contact between you and your audience by offering personalized
            feedback and direct contact at a rate that values your time.
          </TextStyle>
        </CustomContainer>
      </div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </>
  );
}
