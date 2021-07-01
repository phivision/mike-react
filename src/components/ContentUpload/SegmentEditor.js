import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  BlackTitle,
  GridContainer,
  IconStyle,
} from "components/StyledComponents/StyledComponents";
import EditableTypography from "../../components/EditableTypography/EditableTypography";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { DeleteOutline, Edit } from "@material-ui/icons";

export default function SegmentEditor(props) {
  const [segments, setSegments] = useState(JSON.parse(props.segments));
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
    setSegments([...segments, { Name: "", Timestamp: "" }]);
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
            <GridContainer key={idx} direction="column">
              <div style={{ display: "flex" }}>
                <EditableTypography
                  id={idx + "-SectionName"}
                  text={value.Name}
                  name="Name"
                  label="Name"
                  variant="subtitle2"
                  edit={editSection[idx]}
                  style={{ flex: 1 }}
                />
                <IconStyle
                  onClick={() =>
                    setEditSection(() => {
                      editSection[idx] = !editSection[idx];
                      return [...editSection];
                    })
                  }
                >
                  <Edit color="primary" />
                </IconStyle>
                <IconStyle
                  onClick={() => {
                    setEditSection(() => {
                      editSection.splice(idx, 1);
                      return [...editSection];
                    });
                    setSegments(() => {
                      segments.splice(idx, 1);
                      return [...segments];
                    });
                  }}
                >
                  <DeleteOutline color="primary" />
                </IconStyle>
              </div>
              <EditableTypography
                id={idx + "-SectionTimestamp"}
                text={segments[idx].Timestamp}
                name="Timestamp"
                label="Timestamp"
                variant="body2"
                edit={editSection[idx]}
                showLabel={true}
              />
            </GridContainer>
          );
        })}
      </form>
      <IconStyle onClick={() => addSegment()}>
        <AddCircleIcon fontSize="large" color="primary" />
      </IconStyle>
    </div>
  );
}

SegmentEditor.propTypes = {
  segments: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
