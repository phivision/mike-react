import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  BlackTitle,
  GridContainer,
} from "../../components/StyledComponets/StyledComponets";
import EditableTypography from "../../components/EditableTypography/EditableTypography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";

export default function SegmentEditor(props) {
  const [segments, setSegments] = React.useState(JSON.parse(props.segments));
  const [edit, setEdit] = useState(false);
  // const [edit, setEdit] = useState({
  //   name: false,
  //   times: false,
  //   sets: false,
  //   reps: false,
  //   rpe: false,
  // });

  const handleSegmentChange = (e) => {
    let s = [...segments];
    s[e.target.dataset.id][e.target.className] = e.target.value;
    setSegments(s);
    if (props.onChange) {
      props.onChange(s);
    }
  };

  const addSegment = () => {
    setSegments([
      ...segments,
      { Name: "", Timestamp: "", Sets: "", Reps: "", RPE: "" },
    ]);
    setEdit(!edit);
    // setEdit({
    //   ...edit,
    //   name: true,
    //   times: true,
    //   sets: true,
    //   reps: true,
    //   rpe: true,
    // });
  };

  useEffect(() => {
    setSegments(JSON.parse(props.segments));
  }, [props.segments]);

  console.log("edit", edit);

  return (
    <div>
      <form onChange={handleSegmentChange}>
        <BlackTitle>Sections</BlackTitle>
        {segments.map((value, idx) => {
          return (
            <GridContainer key={idx} direction="column">
              <EditableTypography
                id={"Name" + value.Name + idx}
                text={value.Name}
                label="Name"
                variant="subtitle2"
                edit={edit}
                // edit={edit.name}
                // onClick={() => setEdit({ ...edit, name: true })}
              />
              <EditableTypography
                id={"Timestamp" + value.Name + idx}
                text={segments[idx].Timestamp}
                label="Timestamp"
                variant="body2"
                edit={edit}
                showLabel={true}
                // onClick={() => setEdit({ ...edit, times: true })}
              />
              <EditableTypography
                id={"sets" + value.Name + idx}
                text={value.Sets}
                label="Sets"
                variant="body2"
                edit={edit}
                showLabel={true}
                // onClick={() => setEdit({ ...edit, sets: true })}
              />
              <EditableTypography
                id={"reps" + value.Name + idx}
                text={value.Reps}
                label="Reps"
                variant="body2"
                edit={edit}
                showLabel={true}
                // onClick={() => setEdit({ ...edit, reps: true })}
              />
              <EditableTypography
                id={"rpe" + value.Name + idx}
                text={value.RPE}
                label="RPE"
                variant="body2"
                edit={edit}
                showLabel={true}
                // onClick={() => setEdit({ ...edit, rpe: true })}
              />
            </GridContainer>
          );
        })}
      </form>
      <IconButton onClick={addSegment}>
        <AddCircleIcon fontSize="large" color="primary" />
      </IconButton>
    </div>
  );
}

SegmentEditor.propTypes = {
  segments: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
