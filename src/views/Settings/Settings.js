import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { API } from "aws-amplify";
import { Button } from "@material-ui/core";
import ChangePassword from "../../components/Settings/ChangePassword";

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
        setPrice(res.data.data[0].unit_amount);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const deleteSubscription = async () => {
    const myInit = {
      headers: {},
      body: {
        id: props.user,
        subscriptionID: "sub_JOtvIJgjqMEkGE",
      },
      response: true,
    };

    API.post("stripeAPI", "/stripe/api/user/delete/subscription", myInit)
      .then((res) => {
        setPrice(res.data.data[0].unit_amount);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPrice();
  }, [props.user]);

  return (
    <div>
      <ChangePassword />
      <div>{"User ID:" + props.user}</div>
      <Button onClick={() => deleteSubscription()}>Delete Subscription</Button>
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
