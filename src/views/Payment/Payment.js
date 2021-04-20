import { API, Auth } from "aws-amplify";
// import { useHistory } from "react-router-dom";

export default function Payment() {
  // const history = useHistory();

  const getLink = async () => {
    await Auth.currentAuthenticatedUser().then((attributes) => {
      const myInit = {
        headers: {}, // AWS-IAM authorization if using empty headers
        body: {
          connectedID: attributes.username,
          refreshUrl: "localhost:3000/admin/dashboard",
          returnUrl: "localhost:3000/admin/dashboard",
          // refreshUrl: window.location.href,
          // returnUrl: window.location.href,
        },
        response: true,
      };

      API.post("stripeAPI", "/stripe/api/onboarding", myInit)
        .then((res) => console.log(res))
        .catch((err) => {
          console.log(err);
        });
    });
  };

  getLink();
  return null;
}
