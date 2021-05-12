import React, { useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../CustomButtons/Button";

export default function SegmentEditor(props) {
  const [segments, setSegments] = React.useState(JSON.parse(props.segments));

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
  };

  useEffect(() => {
    setSegments(JSON.parse(props.segments));
  }, [props.segments]);

  return (
    <div>
      <form onChange={handleSegmentChange}>
        {segments.map((value, idx) => {
          return (
            <div key={idx}>
              <label>{"Movement " + (idx + 1)}</label>
              <input
                type="text"
                data-id={idx}
                id={"name" + idx}
                value={segments[idx].Name}
                className="Name"
              />
              <input
                type="text"
                data-id={idx}
                id={"timestamp" + idx}
                value={segments[idx].Timestamp}
                className="Timestamp"
              />
              <input
                type="text"
                data-id={idx}
                id={"sets" + idx}
                value={segments[idx].Sets}
                className="Sets"
              />
              <input
                type="text"
                data-id={idx}
                id={"reps" + idx}
                value={segments[idx].Reps}
                className="Reps"
              />
              <input
                type="text"
                data-id={idx}
                id={"rpe" + idx}
                value={segments[idx].RPE}
                className="RPE"
              />
            </div>
          );
        })}
      </form>
      <Button onClick={addSegment}>Add a segment</Button>
    </div>
  );
}

SegmentEditor.propTypes = {
  segments: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};
