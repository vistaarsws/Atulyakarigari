import {
  Avatar,
  Drawer,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  Typography,
} from "@mui/material";
import { Label, Menu as MenuIcon } from "@mui/icons-material";

import notificationIcon from "../../../../assets/images/notificationIcon.svg";
import adminLogoutIcon from "../../../../assets/images/adminLogoutIcon.svg";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getProfile } from "../../../../services/user/userAPI";
import { logout } from "../../../../Redux/features/AuthSlice";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const authToken = useSelector((state) => state.auth.token);

  const [fetchedData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!authToken) {
          console.error("No user profile token found");
          return;
        }

        let decodedToken;
        try {
          decodedToken = jwtDecode(authToken);
        } catch (decodeError) {
          console.error("Invalid token:", decodeError);
          return;
        }

        const { _id } = decodedToken;
        if (!_id) {
          console.error("Invalid token structure");
          return;
        }

        const response = await getProfile(_id);

        if (!response || !response.data) {
          console.error("Invalid API response:", response);
          return;
        }

        const profile = response.data.data;

        const fetchedData = {
          fullName: profile.fullName || "Unknow Admin",
          profilePicture:
            profile.profilePicture || "/static/images/avatar/1.jpg",
        };
        setProfileData(fetchedData);
      } catch (error) {
        console.error("Error fetching profile data:", error.message || error);
      }
    };

    fetchProfileData();
  }, [authToken]);

  // Logout Handler
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");

    window.location.reload();
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        alignItems: "center",

        height: "100vh",
        display: "flex",
        padding: "2rem",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {[
          { label: "Dashboard", path: "/admin" },
          { label: "Products", path: "/admin/products" },
          { label: "Add New Product", path: "/admin/add-product" },
          { label: "Customers", path: "/admin/customers" },
          { label: "Orders", path: "/admin/orders" },
          { label: "Team", path: "/admin/team" },
        ].map((obj) => (
          <ListItem key={obj.label} disablePadding>
            <Link href={obj.path} underline="none">
              <ListItemButton>
                <ListItemText
                  primary={obj.label}
                  primaryTypographyProps={{
                    fontSize: "18px",
                    fontWeight: "semi-bold",
                    color: "#8668df",
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <nav
      className="admin_navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.5rem 1rem",
        backgroundColor: "white",
        color: "#383737",
      }}
    >
      <article>
        {/* Menu Icon and Drawer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon fontSize="large" style={{ color: "#5f3dc3" }} />
          </IconButton>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Box>

        {/* Avatar and Admin Details */}
        <Avatar
          alt="User Profile"
          src={fetchedData?.profilePicture}
          sx={{ width: 56, height: 56, border: "2px solid #fff" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            lineHeight: 1.2,
          }}
        >
          <Typography
            component="h1"
            sx={{ fontSize: "1.6rem", fontWeight: "700", color: "#383737" }}
          >
            {fetchedData?.fullName}
          </Typography>

          <h2 style={{ margin: 0, fontSize: "1rem", color: "#6F6F6F" }}>
            ADMIN
          </h2>
        </Box>
      </article>

      <article>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.8rem",
            border: "1px solid #ccc",
            fontSize: "1.4rem",
            height: "5rem",
            minWidth: "30rem",
            backgroundColor: "transparent",
            outline: "none",
            flexGrow: 1,
          }}
        />

        {/* Notification Icon */}
        <Box sx={{ backgroundColor: "white", border: "1px solid white" }}>
          <img
            src={notificationIcon}
            alt="Notification Icon"
            style={{
              cursor: "pointer",
              width: "2.4rem",
              height: "2.4rem",
              visibility: notificationIcon ? "visible" : "hidden",
            }}
          />
        </Box>

        {/* Logout Icon */}
        <Box sx={{ border: "1px solid white", padding: "1rem" }}>
          <img
            src={adminLogoutIcon}
            alt="Admin Logout Icon"
            style={{
              cursor: "pointer",
              width: "2rem",
              height: "2.4rem",
            }}
            onClick={handleLogout}
          />
        </Box>
      </article>
    </nav>
  );
}
