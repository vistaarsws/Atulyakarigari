import { Link, Outlet, useLocation } from "react-router-dom";
import "./UserProfile.css";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function UserProfile() {
  const location = useLocation();
  const menuItems = [
    { key: "profile", label: "Profile" },
    { key: "profile/wishlist", label: "Wishlist" },
    { key: "profile/orders", label: "Orders" },
    { key: "profile/address", label: "Address" },
    // { key: "contact-us", label: "Contact Us" },
    // { key: "terms-of-use", label: "Terms of use" },
    // { key: "privacy-policy", label: "Privacy Policy" },
    // { key: "user/logout", label: "Log Out" },
  ];

  const isActive = (itemKey) => {
    return location.pathname.endsWith(`/${itemKey}`);
  };

  return (
    <div className="sidebar-container">
      <aside className="sidebar">
        <nav>
          {menuItems.map((item) => {
            const active = isActive(item.key);
            return (
              <Link
                key={item.key}
                to={`/${item.key}`}
                className={`menu-item ${active ? "active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="content-container">
        <div
          style={{
            marginTop: "1rem",
            // border: "2px solid red",
            display: useMediaQuery("(max-width:768px)") ? "flex" : "none",
            justifyContent: "start",
            alignItems: "center",
            padding: "1rem 1rem",
            borderBottom: "1px solid #eeeeee",
            // position: "sticky",
            // top: "14vh",
          }}
        >
          <ArrowBackIcon
            className="arrow-icon"
            style={{ fontSize: 20, margin: "0 1rem 0" }}
            onClick={() => {
              window.history.back();
            }}
          />
          <Typography
            className="arrow-icon"
            variant="h4"
            sx={{
              // marginLeft: "auto",
              // marginRight: "auto",
              color: "#423739",
              fontWeight: 400,
              textTransform: "capitalize",
              fontSize: "16px",
            }}
          >
            {location.pathname.replace("/user/", "")}
          </Typography>
        </div>
        <Box
          sx={{
            // height: "88vh",
            // outline: "1px solid black",
            overflowY: "scroll",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Box>
      </div>
    </div>
  );
}
