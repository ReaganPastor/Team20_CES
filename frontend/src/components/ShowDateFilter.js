import { useState } from "react";
import "./ShowDateFilter.css"; // Import the CSS

function ShowDateFilter({ onChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleStartChange = (e) => {
    setStartDate(e.target.value);
    if (onChange) onChange(e.target.value, endDate);
  };

  const handleEndChange = (e) => {
    setEndDate(e.target.value);
    if (onChange) onChange(startDate, e.target.value);
  };

  return (
    <div className="showdate-filter-container">
      <div className="showdate-input-group">
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={handleStartChange}
          className="showdate-input"
        />
      </div>

      <div className="showdate-input-group">
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={handleEndChange}
          className="showdate-input"
        />
      </div>

      <button
        className="showdate-clear-btn"
        onClick={() => {
          setStartDate("");
          setEndDate("");
          if (onChange) onChange("", "");
        }}
      >
        Clear
      </button>
    </div>
  );
}

export default ShowDateFilter;