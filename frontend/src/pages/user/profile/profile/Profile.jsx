import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  styled,
  TextField,
  useMediaQuery,
} from "@mui/material";

import "./Profile.css";
import {
  fetchProfile,
  updateProfileThunk,
} from "../../../../Redux/features/ProfileSlice";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useSnackbar } from "notistack";

const Profile = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const profile = useSelector((state) => state.profile.profile);
  const authToken = useSelector((state) => state.auth.token);
  const isLoading = useSelector((state) => state.profile.loading);
  const defaultProfilePicture = "/broken-image.jpg";

  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  useEffect(() => {
    dispatch(fetchProfile(authToken));
  }, [dispatch, authToken]);

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        profilePicture: profile.profilePicture || defaultProfilePicture,
      });
    }
  }, [profile]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value === "" ? null : value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      setFormData((prevData) => ({ ...prevData, profilePicture: file }));
    } else {
      enqueueSnackbar("Please upload a valid image (JPEG/PNG).", {
        preventDuplicate: false,
        variant: "error",
      });
    }
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    dispatch(fetchProfile(authToken));
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        formDataToSend.append(key, value !== undefined ? value : "null");
      });

      if (formData.profilePicture instanceof File) {
        formDataToSend.append("profileImage", formData.profilePicture);
      }

      await dispatch(
        updateProfileThunk({ authToken, updatedData: formDataToSend })
      ).unwrap();

      setIsEditing(false);
      dispatch(fetchProfile(authToken)); // Refresh profile data after update
      enqueueSnackbar("Successfully updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Error updating profile", { variant: "error" });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-image-container">
        <div className="profile-image-input-box">
          <Avatar
            src={
              formData.profilePicture instanceof File
                ? URL.createObjectURL(formData.profilePicture)
                : formData.profilePicture
            }
            alt={formData.fullName}
            sx={{ width: 110, height: 110 }}
          />
          {isEditing && (
            <Button
              component="label"
              variant="filled"
              startIcon={<EditIcon />}
              sx={{
                position: "absolute",
                right: "-30%",
                bottom: "-5%",
                display: "flex",
                justifyContent: "center",
                borderRadius: "50%",
                minWidth: "auto",
                padding: 1,

                "& .MuiButton-startIcon": {
                  margin: "0 !important", // Removes unwanted margin from the startIcon
                },
              }}
            >
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          )}
        </div>
      </div>
      <div className="profile-form">
        <div className="profile-fields">
          <div>
            <TextField
              label="Full Name"
              sx={{ mb: 2 }}
              value={formData?.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              fullWidth
              disabled={!isEditing}
            />
            {/* ----------------------------------------------------------------------------------------------------------- */}
            <TextField
              sx={{ mb: 2 }}
              label="Email"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              fullWidth
              disabled={!isEditing}
            />
            {/* ----------------------------------------------------------------------------------------------------------- */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                sx={{ mb: 2, width: "100%" }}
                label="Date of Birth"
                value={
                  formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null
                }
                onChange={(newValue) =>
                  handleInputChange(
                    "dateOfBirth",
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  )
                }
                disabled={!isEditing}
              />
            </LocalizationProvider>
          </div>
          {/* ----------------------------------------------------------------------------------------------------------- */}
          <div>
            <TextField
              sx={{ mb: 2 }}
              label="Contact Number"
              value={formData?.contactNumber || null}
              onChange={(e) =>
                handleInputChange("contactNumber", e.target.value * 1)
              }
              fullWidth
              disabled={!isEditing}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                },
              }}
            />
            {/* ----------------------------------------------------------------------------------------------------------- */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender || ""}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                disabled={!isEditing}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            {/* ----------------------------------------------------------------------------------------------------------- */}
            <TextField
              sx={{ mb: 2 }}
              label="Alternate Contact Number"
              value={formData.alternativeContactNumber || null}
              onChange={(e) =>
                handleInputChange(
                  "alternativeContactNumber",
                  e.target.value * 1
                )
              }
              fullWidth
              disabled={!isEditing}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                },
              }}
            />
          </div>
        </div>
        <div className="profile-buttons">
          {isEditing ? (
            <>
              <Button
                variant="contained"
                onClick={handleSave}
                className="save-button"
                size="large"
                disabled={isLoading}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                className="cancel-button"
                size="large"
                onClick={cancelEditHandler}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              className="edit-button"
              variant="outlined"
              size="large"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
