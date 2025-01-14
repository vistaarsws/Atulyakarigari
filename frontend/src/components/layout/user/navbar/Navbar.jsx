import CART from "../../../../assets/images/cart.svg";
import "./Navbar.css";
import headerLogo from "../../../../assets/images/headerLogo.svg";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import userProfile from "../../../../assets/images/userProfile.png";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import { login, logout } from "../../../../Redux/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
// import avatar from "../../../assets/images/avatar.svg";
// import { useAuth } from "../../../../context/authToken";
// import { Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import {getCart, getProfile } from "../../../../services/user/userAPI";

import Badge from "@mui/material/Badge";
// import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Navbar({ navWithoutSearchBar_list }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  // const [isProfileView, setIsProfileView] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  // const { loginContext, logoutContext, authToken, setauthToken } =
  //   useAuth();

  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.auth.token);

  const { enqueueSnackbar } = useSnackbar();
  // const cookies = Cookies.get("authToken");

  // const StyledBadge = styled(Badge)(({ theme }) => ({
  //   "& .MuiBadge-badge": {
  //     right: -3,
  //     top: 13,
  //     border: `1px solid ${theme.palette.background.paper}`,
  //     padding: "0 2px",
  //     backgroundColor: "#b56f82",
  //     fontSize: "1.2rem",
  //     width: "1.5rem",
  //     height: "1.5rem",
  //   },
  // }));

  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  const [profileData, setProfileData] = useState(null);

  // Fetch Profile Data
  const fetchProfileData = async () => {
    try {
      if (!authToken) {
        console.error("No user profile token found");
        return;
      }

      const { _id } = jwtDecode(authToken);
      if (!_id) {
        console.error("Invalid token structure");
        return;
      }

      const response = await getProfile(_id);
      const profile = response?.data?.data;

      const fetchedData = {
        fullName: profile.fullName,
        profilePicture: profile.profilePicture || "/broken-image.jpg",
      };

      setProfileData(fetchedData);
    } catch (error) {
      console.error("Error fetching profile data: ", error.message || error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  },[authToken]);

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

  const logoutHandler = (isLogout) => {
    if (isLogout === "Logout") {
      enqueueSnackbar("Logout Successfully", { variant: "success" });
      // logoutContext();
      dispatch(logout());
    }
  };

  // useEffect(() => {
  //   // Check if the URL contains "user/wishlist"
  //   const path = window.location.pathname;
  //   if (path.includes("user/") || path.includes("/blogs")) {
  //     setIsProfileView(true);
  //   } else {
  //     setIsProfileView(false);
  //   }
  //   return () => {
  //     setIsProfileView(false);
  //   };
  // }, [window.location.pathname]);
  const navigation = {
    links: [
      { name: "HOME", path: "/" },

      {
        name: "CATEGORIES",
        path: "/categories",
        dropdown: [
          {
            category: "HANDLOOM",
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
                name: "Saree",
                items: [
                  "Sambalpuri Cotton",
                  "Pure Raw Cotton",
                  "Organza",
                  "Kota Doria",
                  "Khandua Silk",
                  "Georgette",
                  "Banarsi Silk",
                ],
              },
              {
                name: "Suit Set",
                items: ["Woolen Suit"],
              },
              {
                name: "Ready To Wear",
                items: [
                  "Bhagalpuri Silk",
                  "Chanderi Silk",
                  "Cotton Silk",
                  "Khadi Silk",
                ],
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
                name: "Facemask",
                items: ["Embroidered", "Printed Cotton"],
              },
              {
                name: "Home Decor",
                items: ["Table Runner"],
              },
            ],
          },
          {
            category: "HANDICRAFT",
            subcategories: [
              {
                name: "",
                items: [
                  "Golden Grass",
                  "Dhokra",
                  "Diary",
                  "Sabai Grass",
                  "Palm Leaves Etching",
                  "Pattachitra",
                ],
              },
            ],
          },
          {
            category: "JEWELLERY",
            subcategories: [
              {
                name: "",
                items: [
                  "Jhumka",
                  "Rings",
                  "Bracelet",
                  "Kamarbandh",
                  "Baju Bnadh",
                  "Payal/Anklet",
                ],
              },
            ],
          },
        ],
      },
      { name: "ARTISANS", path: "/artisans" },
      { name: "ABOUT US", path: "/about" },
      { name: "BLOGS", path: "/blogs" },
    ],
  };

  const menuItems = [
    { name: "Wishlist", link: "/profile/wishlist" },
    { name: "Orders", link: "/profile/orders" },
    { name: "Address", link: "/profile/address" },
    { name: "Logout", link: "/" },

    // { name: "Contact Us", link: "/user/contact" },
    // { name: "Terms of use", link: "/user/terms" },
    // { name: "Privacy Policy", link: "/user/privacy" },
    // { name: "Log Out", link: "/user/logout" },
  ];
  const [cartData, setCartData] = useState(null);
  const fetchCartData = async () => {
    try {
      if (!authToken) {
        console.error("No user profile token found");
        return;
      }

      const { _id } = jwtDecode(authToken);
      if (!_id) {
        console.error("Invalid token structure");
        return;
      }

      const response = await getCart()
      setCartData(response?.data?.data)
      // console.log("response",cartData);
      

    }
    catch (err) {
      console.log(err.message);
      
    }
  }
  useEffect(()=>{
    fetchCartData()
  },[])

  return (
    <nav className="navbar_container">
      {/* <Button onClick={() => navigate("/admin")}>admin</Button> */}
      <figure>
        <Link to={"/"}>
          <img src={headerLogo} alt="Atulyakarigari Logo" />
        </Link>
      </figure>
      <ul
        // className={`navLinks ${isNavVisible || !isMobileView ? "" : "hidden"}`}
        className={` ${isNavVisible || !isMobileView ? "navLinks" : "hidden"} ${
          navWithoutSearchBar_list ? "navWithoutSearchBar_list" : ""
        }`}
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
                    {link.dropdown.map((categoryObj, index) => (
                      <div
                        className={`category ${
                          index !== 0 ? "smallNavMenuSection" : ""
                        }`}
                        key={index}
                      >
                        <h1>{categoryObj.category}</h1>
                        <section>
                          {categoryObj.subcategories.map(
                            (subcategory, subIndex) => (
                              <div key={subIndex}>
                                {subcategory.name && (
                                  <h2>{subcategory.name}</h2>
                                )}
                                <ul>
                                  {subcategory.items.map((item, itemIndex) => (
                                    <li key={itemIndex} id="subcategoryLinks">
                                      {item}
                                      <svg
                                        width="8"
                                        height="8"
                                        viewBox="0 0 8 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="onHoverRightArrow"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M0 4C0 4.13308 0.0526814 4.26071 0.146455 4.35482C0.240228 4.44892 0.367412 4.50179 0.500027 4.50179H6.29368L4.14689 6.65613C4.05857 6.75125 4.01048 6.87707 4.01277 7.00706C4.01506 7.13706 4.06753 7.26109 4.15915 7.35303C4.25076 7.44497 4.37436 7.49763 4.5039 7.49992C4.63344 7.50222 4.75881 7.45396 4.8536 7.36533L7.85377 4.3546C7.9474 4.26051 8 4.13297 8 4C8 3.86703 7.9474 3.73949 7.85377 3.6454L4.8536 0.634675C4.75881 0.546039 4.63344 0.497785 4.5039 0.500079C4.37436 0.502372 4.25076 0.555035 4.15915 0.646971C4.06753 0.738907 4.01506 0.86294 4.01277 0.992937C4.01048 1.12293 4.05857 1.24875 4.14689 1.34387L6.29368 3.49821L0.500027 3.49821C0.367412 3.49821 0.240228 3.55108 0.146455 3.64518C0.0526814 3.73929 0 3.86692 0 4Z"
                                          fill="#60A487"
                                        />
                                      </svg>
                                    </li>
                                  ))}
                                </ul>
                                <div className="dividerLine"></div>
                              </div>
                            )
                          )}
                        </section>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div>
        <div>
          {!navWithoutSearchBar_list && (
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
                    stroke="white"
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
              {/* )} */}
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
          )}
        </div>

        {authToken && (
          <IconButton
            aria-label={notificationsLabel(100)}
            onClick={() => navigate("/view-cart")}
          >
            <Badge
              badgeContent={cartData?.items?.length}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#b56f82",
                  color: "#fff",
                  fontSize: "1.2rem",
                },
              }}
            >
              <ShoppingCartIcon fontSize="large" sx={{ fill: "white" }} />
            </Badge>
          </IconButton>
        )}

        <div
          className="profileBox"
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
        >
          {authToken ? (
            <img  src={profileData?.profilePicture} alt="User Profile" />
          ) : (
            <Avatar src="/broken-image.jpg" />
          )}

          {isProfileHovered && (
            <div className="profile-dropdown">
              {authToken && (
                <div
                  onClick={() => {
                    navigate("/profile");
                    setIsProfileHovered(false);
                  }}
                >
                  <p>Hello, {profileData?.fullName}</p>
                  <p>My profile</p>
                </div>
              )}
              {authToken ? (
                <ul>
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        onClick={() => {
                          setIsProfileHovered(false);
                          logoutHandler(item.name);
                        }}
                        to={item.link}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul>
                  <li>
                    <Link to={"/login"}>Login</Link>
                  </li>
                  <li>
                    <Link to={"/signup"}>Sign Up</Link>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="nav-mobile">
        <button
          id="navbar-toggle"
          onClick={() => {
            setIsNavVisible((prevIsNavVisible) => !prevIsNavVisible);
          }}
          className={isNavVisible ? "active" : ""}
        >
          <span> </span>
        </button>
      </div>
    </nav>
  );
}
