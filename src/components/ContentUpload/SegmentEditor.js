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
    s[e.target.dataset.id][e.target.name] = e.target.value;
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

  return (
    <div>
      <form onChange={handleSegmentChange}>
        <BlackTitle>Sections</BlackTitle>
        {segments.map((value, idx) => {
          return (
            <GridContainer key={idx} direction="column">
              <EditableTypography
                id={"Section-Name" + idx}
                text={value.Name}
                name="Name"
                label="Name"
                variant="subtitle2"
                edit={edit}
                data-id={idx}
                // edit={edit.name}
                // onClick={() => setEdit({ ...edit, name: true })}
              />
              <EditableTypography
                id={"Section-Timestamp" + idx}
                text={segments[idx].Timestamp}
                name="Timestamp"
                label="Timestamp"
                variant="body2"
                edit={edit}
                showLabel={true}
                data-id={idx}
                // onClick={() => setEdit({ ...edit, times: true })}
              />
              <EditableTypography
                id={"Section-sets" + idx}
                text={value.Sets}
                name="Sets"
                label="Sets"
                variant="body2"
                edit={edit}
                showLabel={true}
                data-id={idx}
                // onClick={() => setEdit({ ...edit, sets: true })}
              />
              <EditableTypography
                id={"Section-reps" + idx}
                text={value.Reps}
                name="Reps"
                label="Reps"
                variant="body2"
                edit={edit}
                showLabel={true}
                data-id={idx}
                // onClick={() => setEdit({ ...edit, reps: true })}
              />
              <EditableTypography
                id={"Section-rpe" + idx}
                text={value.RPE}
                name="RPE"
                label="RPE"
                variant="body2"
                edit={edit}
                showLabel={true}
                data-id={idx}
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
