import { API, Auth } from "aws-amplify";

export default function Payment() {
  const getLink = async () => {
    const myInit = {
      headers: {
        Authorization: `Bearer ${(await Auth.currentSession())
          .getIdToken()
          .getJwtToken()}`,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/onboarding", myInit).then((res) =>
      console.log(res)
    );
  };
  getLink();
  return null;
}
