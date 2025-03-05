import "./Navbar.css";
import headerLogo from "../../../../assets/images/headerLogo.svg";
import { NavLink, Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useState, useEffect } from "react";
import { logout } from "../../../../Redux/features/AuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { Button, ListItemIcon, Menu } from "@mui/material";
import { useSnackbar } from "notistack";

import FavoriteIcon from "@mui/icons-material/Favorite";
import { getCategory } from "../../../../services/admin/adminAPI";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { MenuItem } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { fetchCart } from "../../../../Redux/features/CartSlice";
import { fetchWishlist } from "../../../../Redux/features/WishlistSlice";
import { fetchProfile } from "../../../../Redux/features/ProfileSlice";
import { fetchAllProducts } from "../../../../Redux/features/ProductSlice.jsx";
import CloseIcon from "@mui/icons-material/Close";
import useDebounce from "../../../../hooks/useDebounce";
import { fetchAllCategory } from "../../../../Redux/features/CategorySlice.jsx";

export default function Navbar({ navWithoutSearchBar_list }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector((state) => state.wishlist.items);
  const profile = useSelector((state) => state.profile);
  const cartData = useSelector((state) => state.cart);

  const [getAllCategories, setGetAllCategories] = useState([]);
  const [openCategoryIndex, setOpenCategoryIndex] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { products, loading: productsLoading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const authToken = useSelector((state) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch products and categories on mount
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts());
    }
    if (categories.length === 0) {
      dispatch(fetchAllCategory());
    }
  }, [dispatch, products.length, categories.length]);

  // Filter products, categories, and subcategories
  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setFilteredResults([]);
      return;
    }

    const filteredProducts = products.filter((product) =>
      `${product.name} ${product.description} ${product.category} ${product.subcategory}`
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );

    const filteredCategories = categories.filter((category) =>
      `${category.name}`
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
    );

    const filteredSubcategories = categories.flatMap((category) =>
      category.subcategory?.filter((sub) =>
        `${sub.name}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      ) || []
    );

    const combinedResults = [
      ...filteredProducts.map((product) => ({ type: 'product', data: product })),
      ...filteredCategories.map((category) => ({ type: 'category', data: category })),
      ...filteredSubcategories.map((subcategory) => ({ type: 'subcategory', data: subcategory })),
    ];

    setFilteredResults(combinedResults);
    setSelectedIndex(-1);
  }, [debouncedSearch, products, categories]);

  // Handle product selection
  const handleSelectProduct = (product) => {
    navigate(`/product/${product._id}`);
    setSearchQuery("");
    setFilteredResults([]);
  };

  // Handle category selection
  const handleSelectCategory = (category) => {
    console.log("handleSelectCategory", category);
    
    navigate(`/categories/${category.id}`);
    setSearchQuery("");
    setFilteredResults([]);
  };

  // Handle subcategory selection
  const handleSelectSubCategory = (subcategory) => {
    navigate(`/sub-categories/${subcategory._id}`);
    setSearchQuery("");
    setFilteredResults([]);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      const selectedItem = filteredResults[selectedIndex];
      if (selectedItem.type === 'product') {
        handleSelectProduct(selectedItem.data);
      } else if (selectedItem.type === 'category') {
        handleSelectCategory(selectedItem.data);
      } else if (selectedItem.type === 'subcategory') {
        handleSelectSubCategory(selectedItem.data);
      }
    }
  };

  // Fetch categories data
  const fetchCategoriesData = async () => {
    try {
      const response = await getCategory();
      const categories = Object.values(response.data.data);
      if (categories.length) {
        setGetAllCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      enqueueSnackbar("Failed to fetch categories", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [enqueueSnackbar]);

  // Fetch cart, wishlist, and profile data if authenticated
  useEffect(() => {
    if (authToken) {
      dispatch(fetchCart(authToken));
      dispatch(fetchWishlist(authToken));
      dispatch(fetchProfile(authToken));
    }
  }, [authToken, dispatch]);

  // Handle logout
  const logoutHandler = (isLogout) => {
    if (isLogout === "Logout") {
      enqueueSnackbar("Logout Successfully", { variant: "success" });
      dispatch(logout());
    }
  };

  // Navigation links
  const navigation = {
    links: [
      { name: "HOME", path: "/" },
      {
        name: "CATEGORIES",
        path: "#",
        dropdown: getAllCategories.map((category) => ({
          category: category.name,
          category_Details: category,
          subcategories: category.subcategory.map((sub) => ({
            name: sub.name,
            subCategory_Details: sub,
          })),
        })),
      },
      { name: "ARTISANS", path: "/artisans" },
      { name: "ABOUT", path: "/about" },
      { name: "BLOGS", path: "/blogs" },
    ],
  };

  // Menu items for profile dropdown
  const menuItems = [
    { name: "My Profile", link: "/profile" },
    { name: "Wishlist", link: "/profile/wishlist" },
    { name: "Orders", link: "/profile/orders" },
    { name: "Address", link: "/profile/address" },
    {
      name: "Logout",
      link: "/",
      icon: <Logout fontSize="small" />,
    },
  ];
  // -----------------------------------------------------------

  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null); // Close the dropdown if it's already open
    } else {
      setAnchorEl(event.currentTarget); // Open the dropdown
    }
  };

  const toggleCollapse = (index) => {
    setOpenCategoryIndex((prev) => (prev === index ? null : index));
  };


  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 849) {
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


  useEffect(() => {
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    if (authToken) {
      dispatch(fetchCart(authToken));
      dispatch(fetchWishlist(authToken));
      dispatch(fetchProfile(authToken));
    }
  }, [authToken, dispatch]);

  return (
    <nav className="navbar_container">
      <figure>
        <Link to={"/"}>
          <img src={headerLogo} alt="Atulyakarigari Logo" />
        </Link>
      </figure>
      <ul
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
                style={{
                  marginInline: "2rem",
                }}
                to={link.path}
                onClick={() => {
                  if (link.dropdown) {
                    setIsNavVisible(true);
                  } else {
                    setIsNavVisible(false);
                  }
                }}
              >
                {link.name}
              </NavLink>
              {link.dropdown && (
                <div
                  className={`categoryDropdown ${
                    isCategoryHovered === index ? "" : "hide"
                  }`}
                >
                  <div className="categories-container">
                    {link.dropdown.map((categoryObj, catIndex) => (
                      <div
                        id="category"
                        className={`${catIndex !== 0 ? "smallNavMenuSection" : ""}`}
                        key={catIndex}
                      >
                        <div
                          className="category-header"
                          onClick={() => toggleCollapse(catIndex)}
                          aria-expanded={openCategoryIndex === catIndex}
                        >
                          <Link
                            className="underline"
                            to={`/categories/${categoryObj.category_Details._id}`}
                          >
                            <h1>{categoryObj.category}</h1>
                          </Link>
                          <svg
                            className={`collapse-icon ${
                              openCategoryIndex === catIndex ? "open" : ""
                            }`}
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 16L6 10H18L12 16Z" fill="#60A487" />
                          </svg>
                        </div>
                        <section
                          className={`collapse-content ${
                            openCategoryIndex === catIndex ? "show" : ""
                          }`}
                        >
                          {categoryObj.subcategories.map(
                            (subcategory, subIndex) => (
                              <li key={subIndex} id="subcategoryLinks">
                                <Link
                                  className="underline"
                                  to={`/sub-categories/${subcategory?.subCategory_Details?._id}`}
                                >
                                  {subcategory.name}
                                </Link>
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
            <form className="form" onKeyDown={handleKeyDown}>
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
                placeholder="Search here..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <CloseIcon
                  className="clear-icon"
                  fontSize="large"
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredResults([]);
                  }}
                />
              )}

              {/* Search Results Dropdown */}
              {searchQuery && filteredResults.length > 0 && (
                <ul className="search-dropdown">
                  {filteredResults.map((item, index) => (
                    <li
                      key={`${item?.type}-${item?.data?._id || item?.data?.name}`}
                      className={index === selectedIndex ? "selected" : ""}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => {
                        if (item?.type === 'product') {
                          handleSelectProduct(item?.data);
                        } else if (item?.type === 'category') {
                          handleSelectCategory(item?.data);
                        } else if (item?.type === 'subcategory') {
                          handleSelectSubCategory(item?.data);
                        }
                      }}
                    >
                      {item?.type === 'product' && highlightMatch(item?.data?.name, searchQuery)}
                      {item?.type === 'category' && `Category:  ${searchQuery}`}
                      {item?.type === 'subcategory' && `Subcategory:  ${searchQuery}`}
                    </li>
                  ))}
                </ul>
              )}

              {searchQuery && filteredResults.length === 0 && !productsLoading && !categoriesLoading && (
                <ul className="search-dropdown">
                  <li>No results found</li>
                </ul>
              )}

              {(productsLoading || categoriesLoading) && searchQuery && (
                <ul className="search-dropdown">
                  <li>Loading...</li>
                </ul>
              )}
            </form>
          )}
        </div>
        {authToken && (
          <IconButton
            aria-label={`wishlist with ${wishlist.length} items`}
            onClick={() => navigate("/profile/wishlist")}
          >
            <Badge
              badgeContent={wishlist.length}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#b56f82",
                  color: "#fff",
                  fontSize: "1.2rem",
                },
              }}
            >
              <FavoriteIcon fontSize="large" sx={{ fill: "white" }} />
            </Badge>
          </IconButton>
        )}
        {authToken && (
          <IconButton
            aria-label={notificationsLabel(cartData?.items?.length)}
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
        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <div className="profileBox">
              {authToken ? (
                <Avatar
                  src={profile?.profile?.profilePicture}
                  alt={profile?.profile?.fullName}
                />
              ) : (
                <Avatar src="/broken-image.jpg" />
              )}
            </div>
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {authToken && (
              <MenuItem>
                <p>Hello, {profile?.profile?.fullName}</p>
              </MenuItem>
            )}
            {authToken ? (
              <ul>
                {menuItems.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      if (item.name === "Logout") {
                        navigate("/");
                      }
                      navigate(item.link);
                      logoutHandler(item.name);
                      setAnchorEl(null);
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon
                        sx={{
                          minWidth: "unset !important",
                          marginRight: "0.5rem",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    )}
                    {item.name}
                  </MenuItem>
                ))}
              </ul>
            ) : (
              <ul>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/login");
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setAnchorEl(null);
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </MenuItem>
              </ul>
            )}
          </Menu>
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

// Function to highlight matching search text
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="highlight">
        {part}
      </span>
    ) : (
      part
    )
  );
}

