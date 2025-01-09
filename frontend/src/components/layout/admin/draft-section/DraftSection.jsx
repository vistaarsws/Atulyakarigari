import { useState, useRef, useEffect } from "react";
// ------------------------------ react-date-range -------------------------------------------------
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
// -------------------------------------------------------------------------------------------------

import { useSelector } from "react-redux";

import "./DraftSection.css";

export default function DraftSection() {
  const allProducts = useSelector((state) => state.products.products);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const formateTimeStamp = (timeStamp) => {
    const timestamp = timeStamp;
    const date = new Date(timestamp);

    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear()).slice(2)}`;

    return formattedDate;
  };

  const [isOpen, setIsOpen] = useState(false); // State to toggle the calendar visibility
  const calendarRef = useRef(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle opening of calendar when input is clicked
  const handleDateClick = () => {
    setIsOpen(true); // Open calendar on input click
  };
  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB"); // This will return the date in "DD/MM/YYYY"
  };

  const draftedProducts = allProducts?.filter((prod) => prod.status === "Draft");

  return (
    <>
      <div className="draft-sidebar">
        <div className="draft-sidebar-header">
          <h2>Drafts</h2>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              readOnly
              value={`${formatDate(range[0].startDate)} - ${formatDate(range[0].endDate)}`} // Apply the format
              onClick={handleDateClick} // Opens the calendar when clicked
              style={{
                padding: "8px",
                border: "1px solid #6F6F6F33",
                borderRadius: "4px",
                width: "17rem",
                cursor: "pointer",
                backgroundColor: "#f4f4f4",
              }}
            />

            {/* Calendar Popup */}
            {isOpen && (
              <div
                ref={calendarRef} // Reference for outside click detection
                style={{
                  position: "absolute",
                  top: "40px",
                  left: "-100%",
                  zIndex: 10,
                  background: "#fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                }}
              >
                <DateRange
                  onChange={(item) => setRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={range}
                  showDateDisplay={false}
                  months={1}
                  direction="horizontal"
                  staticRanges={[]} // Removes predefined ranges
                  inputRanges={[]} // Removes custom input ranges
                />
              </div>
            )}
          </div>
        </div>

        <div className="draft-list">
          {draftedProducts?.map((draftProduct, index) => (
            <div key={index} className="draft-item">
              <p>{draftProduct.name}</p>
              <span>{formateTimeStamp(draftProduct.createdAt)}</span>
            </div>
          ))}
          {draftedProducts?.length === 0 && <p>No Draft Added</p>}
        </div>
      </div>
    </>
  );
}
