import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { getProfile, updateProfile } from "../../../../services/user/userAPI";
import PROFILE_IMAGE from "../../../../assets/images/userProfile.png";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
import "./Profile.css";

const ProfileField = ({ label, value, onChange, type, isEditable }) => {
  return (
    <div className="profile-field">
      <div className="profile-field-label">{label}</div>
      <input
        type={type || "text"}
        className="profile-input"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={!isEditable}
      />
    </div>
  );
};

const Profile = () => {
  const userProfileToken = useSelector((state) => state.auth.token);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    hintName: "",
    mobile: "",
    gender: "",
    location: "",
    alternateMobile: "",
    profilePicture: PROFILE_IMAGE,
    profilePictureFile: null, // Store the file for uploading
  });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch Profile Data
  const fetchProfileData = async () => {
    try {
      if (!userProfileToken) {
        console.error("No user profile token found");
        return;
      }

      const { _id } = jwtDecode(userProfileToken);
      if (!_id) {
        console.error("Invalid token structure");
        return;
      }

      const response = await getProfile(_id);
      const profile = response.data.data;

      const fetchedData = {
        fullName: profile.fullName || "",
        email: profile.email || "",
        dob: profile.dateOfBirth || "",
        hintName: profile.hintName || "",
        mobile: profile.contactNumber || "",
        gender: profile.gender || "",
        location: profile.location || "",
        alternateMobile: profile.alternativeContactNumber || "",
        profilePicture: profile.profilePicture || PROFILE_IMAGE,
        profilePictureFile: null, // Reset file on fetch
      };

      setFormData(fetchedData);
      setOriginalData(fetchedData); // Store the original data for cancel functionality
    } catch (error) {
      console.error("Error fetching profile data: ", error.message || error);
      toast.error("Failed to fetch profile data.");
    }
  };

  // Handle Input Change
  const handleInputChange = (field, value) => {
    if ((field === "mobile" || field === "alternateMobile") && isNaN(value)) {
      toast.error("Please enter a valid number.");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle Profile Picture Change (file upload)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedFormats = ["image/jpeg", "image/png"];
      if (allowedFormats.includes(file.type)) {
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: URL.createObjectURL(file), // Preview the image
          profilePictureFile: file, // Store the file for uploading
        }));
      } else {
        toast.error("Please upload a valid image (JPEG/PNG).");
      }
    }
  };

  // Save Updated Profile
  const handleSave = async () => {
   
    try {
      if (!userProfileToken) {
        toast.error("User token is missing. Please log in again.");
        return;
      }

      const { _id } = jwtDecode(userProfileToken);
      if (!_id) {
        toast.error("Invalid user ID. Please try again.");
        return;
      }

      const updatedData = {
        fullName: formData.fullName || "",
        email: formData.email || "",
        dateOfBirth: formData.dob || "",
        hintName: formData.hintName || "",
        contactNumber: formData.mobile || "",
        gender: formData.gender || "",
        location: formData.location || "",
        alternativeContactNumber: formData.alternateMobile || "",
        profilePicture: formData.profilePicture || "null",
      };
      

      const formDataToSend = new FormData();
      Object.keys(updatedData).forEach((key) => {
        formDataToSend.append(key, updatedData[key]);
      });

      // Append the profile picture file if available
      if (formData.profilePictureFile) {
        formDataToSend.append("profileImage", formData.profilePictureFile);
      }

      console.log("Sending updated data to API:", updatedData); // Debug log

      toast.loading("Updating profile...");
      const response = await updateProfile(_id, formDataToSend); 

      // Debugging API response
      console.log("API Response:", response);

      if (response.data.success) {
        toast.dismiss();
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfileData(); // Refresh profile data
      } else {
        toast.dismiss();
        toast.error(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error updating profile: ", error.message || error);
      toast.error("An error occurred while updating the profile.");
    }
  };

  // Cancel Editing and Restore Original Data
  const handleCancel = () => {
    setFormData({ ...originalData }); // Restore the original data
    setIsEditing(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, [userProfileToken]);

  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <img
          src={formData.profilePicture}
          alt="Profile"
          className="profile-image"
        />
        {isEditing && (
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
            className="file-input"
          />
        )}
      </div>
      <div className="profile-form">
        <div className="profile-fields">
          <div>
            <ProfileField
              label="Full Name"
              value={formData.fullName}
              onChange={(value) => handleInputChange("fullName", value)}
              isEditable={isEditing}
            />
            <ProfileField
              label="Email ID"
              value={formData.email}
              onChange={(value) => handleInputChange("email", value)}
              isEditable={isEditing}
            />
            <ProfileField
              label="Date of Birth"
              value={formData.dob}
              onChange={(value) => handleInputChange("dob", value)}
              type="date"
              isEditable={isEditing}
            />
            <ProfileField
              label="Hint Name"
              value={formData.hintName}
              onChange={(value) => handleInputChange("hintName", value)}
              isEditable={isEditing}
            />
          </div>
          <div>
            <ProfileField
              label="Mobile Number"
              value={formData.mobile}
              onChange={(value) => handleInputChange("mobile", value)}
              isEditable={isEditing}
            />
            <ProfileField
              label="Gender"
              value={formData.gender}
              onChange={(value) => handleInputChange("gender", value)}
              isEditable={isEditing}
            />
            <ProfileField
              label="Location"
              value={formData.location}
              onChange={(value) => handleInputChange("location", value)}
              isEditable={isEditing}
            />
            <ProfileField
              label="Alternate Mobile"
              value={formData.alternateMobile}
              onChange={(value) => handleInputChange("alternateMobile", value)}
              isEditable={isEditing}
            />
          </div>
        </div>

        <div className="profile-buttons">
          {!isEditing ? (
            <Button
              className="edit-button"
              variant="outlined"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className="save-button"
                size="large"
                variant="contained"
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                className="cancel-button"
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
