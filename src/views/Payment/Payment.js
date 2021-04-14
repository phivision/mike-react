import { API } from "aws-amplify";

export default function Payment() {
  const getLink = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/onboarding", myInit)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };
  getLink();
  return null;
}
