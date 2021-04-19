import { API } from "aws-amplify";

export default function Checkout() {
  const getLink = async () => {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        connectedID: "",
        refreshUrl: "",
        returnUrl: "",
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/checkout", myInit)
      .then((res) => console.log(res))
      .catch((err) => {
        console.log(err);
      });
  };
  getLink();
  return null;
}
