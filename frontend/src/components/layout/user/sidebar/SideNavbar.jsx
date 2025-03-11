import { useState } from "react";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import "./SideNavbar.css";
import { Link, useNavigate } from "react-router-dom";

const SideNavbar = ({ user, linksArray }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState(null);

  const toggleMenu = (link) => {
    setIsOpen(!isOpen);
    if (link) {
      navigate(link);
    }
  };
  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index);
    setOpenSubcategory(null);
  };
  const toggleSubcategory = (index) => {
    setOpenSubcategory(openSubcategory === index ? null : index);
  };



  return (
    <div className="sidenav-container">
      <button onClick={toggleMenu} className="menu-btn">
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`sidenav ${isOpen ? "open" : ""}`}>
        <div className="profile-section">
          <FaUser className="profile-icon" />
          <span className="profile-name">{user}</span>
        </div>
        <div>
          <ul className="sidenav-list">
            {linksArray.map((link, index) => (
              <ul key={index} className="sidenav-item">
                {/* If the link has subcategories (dropdown), render a button */}
                {link.dropdown ? (
                  <li className="sidenav-category">
                    <button
                      onClick={() => toggleCategory(index)}
                      className="category-btn"
                    >
                      {link.name}
                    </button>
                    {openCategory === index && (
                      <ul className="subcategory-list">
                        {link.dropdown.map((category, catIndex) => (
                          <li key={catIndex} className="subcategory-item">
                            <button
                              onClick={() => toggleSubcategory(catIndex)}
                              className="subcategory-btn"
                            >
                              {category.category}
                            </button>
                            {openSubcategory === catIndex &&
                              category.subcategories && (
                                <ul className="sub-subcategory-list">
                                  {category.subcategories.map(
                                    (sub, subIndex) => (
                                      <li
                                        key={subIndex}
                                        className="sub-subcategory-item"
                                      >
                                        <button
                                          onClick={() =>
                                            toggleMenu(
                                              `/sub-categories/${sub?.subCategory_Details?._id}`
                                            )
                                          }
                                          className="sub-subcategory-btn"
                                        >
                                          {sub.name}
                                        </button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  // Normal links
                  <li
                    className="sidenav-item"
                    onClick={() => toggleMenu(link.path)}
                  >
                    {link.name}
                  </li>
                )}
              </ul>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default SideNavbar;
