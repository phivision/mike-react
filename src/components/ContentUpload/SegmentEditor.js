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
  const [editSection, setEditSection] = useState([]);
  useEffect(() => {
    if (editSection.length < segments.length) {
      for (var i = 0; i < segments.length; i++) {
        setEditSection(() => {
          editSection.push(false);
          return [...editSection];
        });
      }
    }
  }, [editSection.length < segments.length]);

  const handleSegmentChange = (e) => {
    let s = [...segments];
    var dataId = e.target.id.split("-", 1);
    s[dataId][e.target.name] = e.target.value;
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
    setEditSection(() => {
      editSection.push(true);
      return [...editSection];
    });
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
            <GridContainer
              key={idx}
              direction="column"
              onClick={() =>
                setEditSection(() => {
                  editSection[idx] = true;
                  return [...editSection];
                })
              }
            >
              <EditableTypography
                id={idx + "-SectionName"}
                text={value.Name}
                name="Name"
                label="Name"
                variant="subtitle2"
                edit={editSection[idx]}
              />
              <EditableTypography
                id={idx + "-SectionTimestamp"}
                text={segments[idx].Timestamp}
                name="Timestamp"
                label="Timestamp"
                variant="body2"
                edit={editSection[idx]}
                showLabel={true}
              />
              <EditableTypography
                id={idx + "-SectionSets"}
                text={value.Sets}
                name="Sets"
                label="Sets"
                variant="body2"
                edit={editSection[idx]}
                showLabel={true}
              />
              <EditableTypography
                id={idx + "-SectionReps"}
                text={value.Reps}
                name="Reps"
                label="Reps"
                variant="body2"
                edit={editSection[idx]}
                showLabel={true}
              />
              <EditableTypography
                id={idx + "-SectionRpe"}
                text={value.RPE}
                name="RPE"
                label="RPE"
                variant="body2"
                edit={editSection[idx]}
                showLabel={true}
              />
            </GridContainer>
          );
        })}
      </form>
      <IconButton onClick={() => addSegment()}>
        <AddCircleIcon fontSize="large" color="primary" />
      </IconButton>
    </div>
  );
}

SegmentEditor.propTypes = {
  segments: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
