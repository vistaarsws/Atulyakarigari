import { Link, Outlet, useLocation } from "react-router-dom";
import "./user.css";

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
        <Outlet />
      </div>
    </div>
  );
}
