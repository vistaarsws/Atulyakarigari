import {
  Avatar,
  Drawer,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import notificationIcon from "../../../../assets/images/notificationIcon.svg";
import adminLogoutIcon from "../../../../assets/images/adminLogoutIcon.svg";
import "./Navbar.css";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box
      sx={{
        width: 250,
        alignItems: "center",
        border: "1px solid red",
        height: "100vh",
        display: "flex",
        padding: "2rem",
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <List>
        {[
          "Dashboard",
          "Products",
          "Add New Product",
          "Customers",
          "Orders",
          "Team",
        ].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontSize: "18px",
                  fontWeight: "semi-bold",
                  color: "#8668df",
                }}
              />
            </ListItemButton>
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
        backgroundColor: "#5f3dc3",
        color: "#fff",
      }}
    >
      <article style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Menu Icon and Drawer */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
          </Drawer>
        </Box>

        {/* Avatar and Admin Details */}
        <Avatar
          alt="Rishit"
          src="/static/images/avatar/1.jpg"
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
          <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold" }}>
            Rishit
          </h1>
          <h2 style={{ margin: 0, fontSize: "1rem", color: "#ddd" }}>Admin</h2>
        </Box>
      </article>

      <article style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search..."
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            width: "250px",
            backgroundColor: "transparent",
            color: "#fff",
            outline: "none",
          }}
        />

        {/* Notification Icon */}
        <div>
          <img
            src={notificationIcon}
            alt="Notification Icon"
            style={{
              cursor: "pointer",
              width: "30px",
              height: "30px",
              visibility: notificationIcon ? "visible" : "hidden",
            }}
          />
        </div>

        {/* Logout Icon */}
        <div>
          <img
            src={adminLogoutIcon}
            alt="Admin Logout Icon"
            style={{
              cursor: "pointer",
              width: "30px",
              height: "30px",
            }}
          />
        </div>
      </article>
    </nav>
  );
}
