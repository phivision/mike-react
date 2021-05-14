import React, { useEffect, useState } from "react";
import visaIcon from "../../assets/img/card/Visa.png";
import mastercardIcon from "../../assets/img/card/MasterCard.png";
import discoverIcon from "../../assets/img/card/Discover.png";
import amexIcon from "../../assets/img/card/AmericanExpress.png";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";

const PaymentMethod = ({ ...props }) => {
  const [image, setImage] = useState();

  const renderCardIcon = () => {
    let cardBrand = props.PaymentMethod.card.brand.toLowerCase();
    switch (cardBrand) {
      case "visa":
        setImage(visaIcon);
        break;
      case "american express":
        setImage(amexIcon);
        break;
      case "masterCard":
        setImage(mastercardIcon);
        break;
      case "discover":
        setImage(discoverIcon);
        break;
    }
  };

  useEffect(() => {
    if (props.PaymentMethod) renderCardIcon();
  }, [props]);

  return (
    <Grid container>
      <Grid item xs={1}>
        <img style={{ height: "20px" }} src={image} />
      </Grid>
      <Grid item xs={3}>
        <Typography variant="body2">
          {"**** **** ****" + props.PaymentMethod.card.last4}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography variant="body2">
          {props.PaymentMethod.card.exp_month +
            "/" +
            (props.PaymentMethod.card.exp_year % 100)}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          variant="outlined"
          disabled={props.isDefault}
          onClick={() => props.defaultCallback(props.PaymentMethod.id)}
        >
          {props.isDefault ? "Default" : "Make Default"}
        </Button>
      </Grid>
      {props.isDefault ? null : (
        <Grid item>
          <IconButton
            onClick={() => props.deleteCallback(props.PaymentMethod.id)}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Grid>
      )}
    </Grid>
  );
};

PaymentMethod.propTypes = {
  PaymentMethod: PropTypes.shape({
    card: PropTypes.shape({
      brand: PropTypes.string,
      exp_month: PropTypes.number,
      exp_year: PropTypes.number,
      last4: PropTypes.string,
    }),
    id: PropTypes.string,
  }),
  deleteCallback: PropTypes.func,
  defaultCallback: PropTypes.func,
  isDefault: PropTypes.bool,
};

export default PaymentMethod;
