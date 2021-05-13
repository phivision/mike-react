import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import EditableTypography from "../EditableTypography/EditableTypography";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import React, { useState } from "react";
import DoneIcon from "@material-ui/icons/Done";
import PropTypes from "prop-types";

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
    <TableRow>
      <TableCell>
        <EditableTypography
          text={price}
          edit={edit}
          label="Monthly Subscription Price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={onClick}>
          {edit ? <DoneIcon /> : <EditIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

TrainerPrice.propTypes = {
  price: PropTypes.string,
  changePrice: PropTypes.func,
};

export default TrainerPrice;
