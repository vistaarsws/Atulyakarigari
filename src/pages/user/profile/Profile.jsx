import React, { useState } from "react";
import PROFILE_IMAGE from "../../../assets/images/userProfile.png";
import { Button } from "@mui/material";
import "./Profile.css"; // Import the CSS file

const ProfileField = ({ label, value, onChange, type }) => {
  return (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <input
        type={type || "text"}
        className="profile-input"
        value={value}
        onChange={(e) => onChange(e.target.value)} // Handle input change
      />
    </div>
  );
};

const ProfileComponent = () => {
  const [formData, setFormData] = useState({
    fullName: "Savvy Srivastava Srivastava",
    email: "savvysrivastava4@gmail.com",
    dob: "2000-01-23",
    hintName: "Sanskaar Singh",
    mobile: "+91 8175961513",
    gender: "Female",
    location: "-NOT ADDED-",
    alternateMobile: "+91 9617153315",
  });

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Updated Profile Data: ", formData);
  };

  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <img src={PROFILE_IMAGE} alt="Profile" className="profile-image" />
      </div>
      <div className="profile-form">
        <div className="profile-fields">
          <div>
            <ProfileField
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
            />
            <ProfileField
              label="Email ID"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
            />
            <ProfileField
              label="Date of Birth"
              value={formData.dob}
              onChange={(value) => handleInputChange("dob", value)}
              type="date" // Set input type to date
            />
            <ProfileField
              label="Hint Name"
              value={formData.hintName}
              onChange={(value) => handleInputChange("hintName", value)}
            />
          </div>
          <div>
            <ProfileField
              label="Mobile Number"
              value={formData.mobile}
              onChange={(value) => handleInputChange("mobile", value)}
            />
            <ProfileField
              label="Gender"
              value={formData.gender}
              onChange={(value) => handleInputChange("gender", value)}
            />
            <ProfileField
              label="Location"
              value={formData.location}
              onChange={(value) => handleInputChange("location", value)}
            />
            <ProfileField
              label="Alternate Mobile"
              value={formData.alternateMobile}
              onChange={(value) => handleInputChange("alternateMobile", value)}
            />
          </div>
        </div>

        <div className="profile-buttons">
          <Button className="edit-button" variant="outlined">
            Edit
          </Button>
          <Button
            className="save-button"
            size="large"
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
