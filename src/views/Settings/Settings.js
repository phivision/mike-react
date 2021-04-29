import React, { useEffect, useState } from "react";
import Button from "components/CustomButtons/Button.js";
import PropTypes from "prop-types";
import { API } from "aws-amplify";

export default function Settings(props) {
  const [price, setPrice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
        newPrice: price,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/update/price", myInit)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    setPrice(event.target.value);
  };

  async function getPrice() {
    const myInit = {
      headers: {}, // AWS-IAM authorization if using empty headers
      body: {
        id: props.user,
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/trainer/get/price", myInit)
      .then((res) => {
        console.log(res);
        setPrice(res.data.data[0].unit_amount);
      })
      .catch((err) => {
        console.log(err);
      });
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
