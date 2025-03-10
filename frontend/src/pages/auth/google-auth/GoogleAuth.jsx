import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Box,
  Typography,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../../../Redux/features/AuthSlice";
import { useDispatch } from "react-redux";

const GoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleLogin = async (response) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/google`,
        {
          token: response.credential,
        }
      );
      setSuccess(true);
      dispatch(login(res.data.data.token));
      navigate("/");
      // Handle successful authentication (e.g., store token, redirect)
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Authentication failed. Please try again."
      );
      console.error("Google Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
          OR
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>

      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <Box
          sx={{
            "& > div": { width: "100% !important" },
            "& iframe": { scale: "1.2" },
          }}
        >
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Login Failed")}
            theme="filled_blue"
            size="large"
            text="continue_with"
            shape="rectangular"
          />
        </Box>
      )}

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          Successfully logged in!
        </Alert>
      </Snackbar>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
