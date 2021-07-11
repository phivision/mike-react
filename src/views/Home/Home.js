import React from "react";
import {
  CustomContainer,
  TextStyle,
} from "../../components/StyledComponents/StyledComponents";

export default function Home() {
  return (
    <>
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
    </>
  );
}
