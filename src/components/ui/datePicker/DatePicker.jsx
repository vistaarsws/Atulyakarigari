import { useState } from "react";
import { Calendar } from "primereact/calendar";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "./DatePicker.css";

export default function RangeDemo() {
  const [dates, setDates] = useState(null);

  return (
    <div className="datePicker_container">
      <Calendar
        value={dates}
        onChange={(e) => setDates(e.value)}
        selectionMode="range"
        readOnlyInput
        hideOnRangeSelection
        placeholder="Pick a Date"
      />
    </div>
  );
}
