import "./Navbar.css";
import headerLogo from "../../../assets/images/headerLogo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import userProfile from "../../../assets/images/userProfile.png";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1210) {
        setIsMobileView(true);
        setIsNavVisible(false);
      } else {
        setIsMobileView(false);
        setIsNavVisible(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navigation = {
    links: [
      { name: "HOME", path: "/" },
      { name: "SHOP", path: "/shop" },
      {
        name: "CATEGORIES",
        path: "/collection",
        dropdown: {
          handloom: {
            categoryName: "Handloom",
            subcategories: [
              {
                name: "Lehenga",
                items: [
                  "Zardozi",
                  "Zari with Kundan Touch",
                  "Zari",
                  "Resham",
                  "Banarsi",
                ],
              },
              {
                name: "Facemask",
                items: ["Embroidered", "Printed Cotton"],
              },
              {
                name: "Saree",
                items: [
                  "Sambalpuri Cotton",
                  "Pure raw cotton",
                  "Organza",
                  "Kota Doria",
                  "Khandua Silk",
                  "Georgette",
                  "Banarsi Silk",
                ],
              },
              {
                name: "Home Decor",
                items: ["Table Runner"],
              },
              {
                name: "Suit Set",
                items: ["Woolen Suit"],
              },
              {
                name: "Tie",
                items: [
                  "Bhagalpuri Silk",
                  "Chanderi Silk",
                  "Cotton Silk",
                  "Khadi Silk",
                ],
              },
              {
                name: "Ready To Wear",
                items: ["Gulal", "Pretty Skirt & Top"],
              },
              {
                name: "Dupatta",
                items: ["Banarsi"],
              },
              {
                name: "Accessories",
                items: ["Potli Bag", "Footwear", "Clutch"],
              },
            ],
          },
          handicraft: {
            categoryName: "Handicraft",
            subcategories: [
              {
                name: "Golden Grass",
              },
              {
                name: "Dhokra",
              },
              {
                name: "Diary",
              },
              {
                name: "Sabai Grass",
              },
              {
                name: "Palm Leaves Etching",
              },
              {
                name: "Pattachitra",
              },
            ],
          },
          jewellery: {
            categoryName: "Jewellery",
            subcategories: [
              {
                name: "Jhumka",
              },
              {
                name: "Rings",
              },
              {
                name: "Bracelet",
              },
              {
                name: "Kamarbandh",
              },
              {
                name: "Baju Bandh",
              },
              {
                name: "Payal/Anklet",
              },
            ],
          },
        },
      },
      { name: "ARTISANS", path: "/artisans" },
      { name: "ABOUT US", path: "/about" },
      { name: "BLOGS", path: "/blogs" },
    ],
  };
  const menuItems = [
    { name: "Wishlist", link: "/user/wishlist" },
    { name: "Orders", link: "/user/orders" },
    { name: "Address", link: "/user/address" },
    { name: "Contact Us", link: "/user/contact" },
    { name: "Terms of use", link: "/user/terms" },
    { name: "Privacy Policy", link: "/user/privacy" },
    { name: "Log Out", link: "/user/logout" },
  ];
  return (
    <nav className="navbar_container">
      <figure>
        <Link to={"/"}>
          <img src={headerLogo} alt="Atulyakarigari Logo" />
        </Link>
      </figure>
      <ul
        className={`navLinks ${isNavVisible || !isMobileView ? "" : "hidden"}`}
      >
        {navigation.links.map((link, index) => {
          return (
            <li
              key={index}
              onMouseOver={() => setIsCategoryHovered(index)}
              onMouseOut={() => setIsCategoryHovered(null)}
            >
              <NavLink
                to={link.path}
                onClick={() => {
                  setIsNavVisible(false);
                }}
              >
                {link.name}
              </NavLink>
              {link.dropdown && (
                <div
                  style={{ position: "absolute", zIndex: "999" }}
                  className={`category ${
                    isCategoryHovered === index ? "" : "hide"
                  }`}
                >
                  <div className="categories-container">
                    <div className="category">
                      <h1>HANDLOOM</h1>
                      <section>
                        <div>
                          <h2>
                            <strong>Lehenga</strong>
                          </h2>
                          <ul>
                            <li>Zardozi</li>
                            <li>Zari with Kundan Touch</li>
                            <li>Zari</li>
                            <li>Resham</li>
                            <li>Banarsi</li>
                          </ul>
                        </div>
                        <div>
                          <h2>
                            <strong>Facemask</strong>
                          </h2>
                          <ul>
                            <li>Embroidered</li>
                            <li>Printed Cotton</li>
                          </ul>
                        </div>
                        <div>
                          <h2>
                            <strong>Saree</strong>
                          </h2>
                          <ul>
                            <li>Sambalpuri Cotton</li>
                            <li>Pure Raw Cotton</li>
                            <li>Organza</li>
                            <li>Kota Doria</li>
                            <li>Khandua Silk</li>
                            <li>Georgette</li>
                            <li>Banarsi Silk</li>
                          </ul>
                        </div>
                        <div>
                          <h2>
                            <strong>Home Decor</strong>
                          </h2>
                          <ul>
                            <li>Table Runner</li>
                          </ul>
                        </div>
                        {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------ */}
                        <div>
                          <h2>
                            <strong>Suit Set</strong>
                          </h2>
                          <ul>
                            <li>Woolen Suit</li>
                          </ul>
                        </div>
                        <div>
                          <h2>
                            <strong>Tie</strong>
                          </h2>
                          <ul>
                            <li>Bhagalpuri Silk</li>
                            <li>Chanderi Silk</li>
                            <li>Cotton Silk</li>
                            <li>Khadi Silk</li>
                          </ul>
                        </div>
                        <div>
                          <h2>
                            <strong>Ready To Wear</strong>
                          </h2>
                          <ul>
                            <li>Bhagalpuri Silk</li>
                            <li>Chanderi Silk</li>
                            <li>Cotton Silk</li>
                            <li>Khadi Silk</li>
                          </ul>
                        </div>
                      </section>
                    </div>

                    <div className="category">
                      <h1>HANDICRAFT</h1>
                      <ul>
                        <li>Golden Grass</li>
                        <li>Dhokra</li>
                        <li>Diary</li>
                        <li>Sabai Grass</li>
                        <li>Palm Leaves Etching</li>
                        <li>Pattachitra</li>
                      </ul>
                    </div>

                    <div className="category">
                      <h1>JEWELLERY</h1>
                      <ul>
                        <li>Jhumka</li>
                        <li>Rings</li>
                        <li>Bracelet</li>
                        <li>Kamarbandh</li>
                        <li>Baju Bnadh</li>
                        <li>Payal/Anklet</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div>
        <form className="form">
          <button>
            <svg
              width="17"
              height="16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby="search"
            >
              <path
                d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.333"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <input
            className="input"
            placeholder="What are you looking for ?"
            required=""
            type="text"
          />
          <button className="reset" type="reset">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </form>
      </div>
      <div
        className="profileBox"
        onMouseEnter={() => setIsProfileHovered(true)}
        onMouseLeave={() => setIsProfileHovered(false)}
      >
        <img src={userProfile} alt="User Profile" />
        {isProfileHovered && (
          <div className="profile-dropdown">
            <div
              onClick={() => {
                navigate("/user/profile");
                setIsProfileHovered(false);
              }}
            >
              <p>Hello, Savvy Srivastava</p>
              <p>8175961513</p>
            </div>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    onClick={() => setIsProfileHovered(false)}
                    to={item.link}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="nav-mobile">
        <button
          id="navbar-toggle"
          onClick={() => {
            setIsNavVisible(!isNavVisible);
          }}
          className={isNavVisible ? "active" : ""}
        >
          <span></span>
        </button>
      </div>
    </nav>
  );
}
