import React, { useEffect, useState } from "react";
import Button from "components/CustomButtons/Button.js";
import PropTypes from "prop-types";
import { API, graphqlOperation } from "aws-amplify";
import { getUserProfile } from "../../graphql/queries";
import { updateUserProfile } from "../../graphql/mutations";

export default function Settings(props) {
  const [price, setPrice] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit");
    console.log(price);
    console.log(props.user);
    const updatedProfile = { id: props.user, Price: price };
    await API.graphql(
      graphqlOperation(updateUserProfile, { input: updatedProfile })
    )
      .then(() => {
        console.log("success");
      })
      .catch((e) => {
        console.log("cannot update user profile!");
        console.log(e);
      });
  };

  const handleChange = (event) => {
    setPrice(event.target.value);
  };

  async function getPrice() {
    const userProfileData = await API.graphql(
      graphqlOperation(getUserProfile, { id: props.user })
    );
    setPrice(userProfileData.data.getUserProfile.Price);
  }

  useEffect(() => {
    getPrice();
  }, [props.user]);

  return (
    <div>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
      <Button color="primary">Change Password</Button>
      <div>{"User ID:" + props.user}</div>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          <input type="text" value={price} onChange={(e) => handleChange(e)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

Settings.propTypes = {
  user: PropTypes.string,
};
