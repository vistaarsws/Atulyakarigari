import { Link, Outlet, useLocation } from "react-router-dom";
import "./user.css";
import { Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Sidebar() {
  const location = useLocation();
  const menuItems = [
    { key: "user/profile", label: "Profile" },
    { key: "user/wishlist", label: "Wishlist" },
    { key: "user/orders", label: "Orders" },
    { key: "user/address", label: "Address" },
    { key: "contact-us", label: "Contact Us" },
    { key: "terms-of-use", label: "Terms of use" },
    { key: "privacy-policy", label: "Privacy Policy" },
    { key: "user/logout", label: "Log Out" },
  ];
  console.log(location.pathname);

  const isActive = (itemKey) => {
    return location.pathname.includes(`/${itemKey}`);
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
            // border: "2px solid red",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <ArrowBackIcon
            className="arrow-icon"
            style={{ fontSize: 30, margin: "0 1rem 0" }}
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
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {location.pathname.replace("/user/", "")}
          </Typography>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
