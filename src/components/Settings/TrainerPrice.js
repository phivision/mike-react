import EditableTypography from "../EditableTypography/EditableTypography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState } from "react";
import DoneIcon from "@material-ui/icons/Done";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";

const TrainerPrice = ({ ...props }) => {
  const [edit, setEdit] = useState(false);
  const [price, setPrice] = useState(props.price / 100);

  const onClick = () => {
    if (!edit) {
      setEdit(true);
    } else {
      if (props.price !== price * 100) {
        props.changePrice(price * 100);
      }
      setEdit(false);
    }
  };

  return (
    <Grid
      item
      container
      direction="row"
      alignItems="center"
      justify="space-between"
      style={{ padding: "10px" }}
    >
      <Grid item>
        <EditableTypography
          text={price}
          edit={edit}
          variant="h3"
          label="Monthly Subscription Price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
      </Grid>
      <Grid item>
        <IconButton onClick={onClick}>
          {edit ? <DoneIcon /> : <EditIcon />}
        </IconButton>
      </Grid>
    </Grid>
  );
};

TrainerPrice.propTypes = {
  price: PropTypes.number,
  changePrice: PropTypes.func,
};

export default TrainerPrice;
