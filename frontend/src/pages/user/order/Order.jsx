import { useState } from "react";
import { Box, Button, InputBase, useMediaQuery } from "@mui/material";
import {
  FilterList,
  Search,
  ChevronLeft,
  ChevronRight,
  StarBorder,
} from "@mui/icons-material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TEST_01 from "../../../assets/images/order-img.png";
import TEST_02 from "../../../assets/images/aboutBanner.png";
import TEST_03 from "../../../assets/images/artistry_1.png";
import TEST_04 from "../../../assets/images/ourCollections_2.png";
import EditAddressModal from "./FilterModal";

export default function Component() {
  const orders = [
    {
      id: 1,
      status: "Delivered",
      date: "On Wed, 3 Apr 2024",
      product: "BANARSI SAARI",
      description:
        "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
      exchangeDate: "Wed, 10 Apr 2024",
      image: TEST_01,
    },
    {
      id: 2,
      status: "Delivered",
      date: "On Wed, 3 Apr 2024",
      product: "BANARSI SAARI",
      description:
        "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
      exchangeDate: "Wed, 10 Apr 2024",
      image: TEST_02,
    },
    {
      id: 1,
      status: "Delivered",
      date: "On Wed, 3 Apr 2024",
      product: "BANARSI SAARI",
      description:
        "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
      exchangeDate: "Wed, 10 Apr 2024",
      image: TEST_03,
    },
    {
      id: 2,
      status: "Delivered",
      date: "On Wed, 3 Apr 2024",
      product: "BANARSI SAARI",
      description:
        "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
      exchangeDate: "Wed, 10 Apr 2024",
      image: TEST_04,
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const breakpoints = {
    max768: useMediaQuery("(max-width:768px)"),
    min769Max1024: useMediaQuery("((min-width:769px) and (max-width:1024px))"),
  };

  const handleArrowClick = (index) => {
    setCurrentImageIndex(index);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            height: useMediaQuery("(max-width:768px)") ? "86vh" : "91vh",
            padding: useMediaQuery("(max-width:425px)") ? "2rem" : "2rem 4rem",
            width:
              (breakpoints.max768 && "100%") ||
              (breakpoints.min769Max1024 && "60%") ||
              "70%",
            gap: "56px",
          }}
        >
          <div
            style={{
              width: "100%",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                // padding: breakpoints.max768 ? "0px" : "24px",
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
                flexDirection:
                  (breakpoints.max768 || breakpoints.min769Max1024) && "column",
              }}
            >
              <Box
                sx={{
                  marginBottom: breakpoints.max768 ? "1rem" : "1rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: 900,
                    marginBottom: "4px",
                    color: "rgba(56, 55, 55, 1)",
                  }}
                >
                  All Orders
                </h2>
                <p
                  style={{
                    fontSize: "12px",
                    color: "rgba(111, 111, 111, 1)",

                    fontWeight: 400,
                  }}
                >
                  from anytime
                </p>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: useMediaQuery(
                    "((min-width:769px) and (max-width:1024px))"
                  )
                    ? "start"
                    : "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "4px",
                    padding: "4px 0px",
                    flex: 1,
                  }}
                >
                  <Search sx={{ color: "#60a487", mr: 1, fontSize: 28 }} />
                  <InputBase
                    sx={{ flex: 1, fontSize: "16px" }}
                    placeholder="Search in orders"
                  />
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<FilterList sx={{ fontSize: 24 }} />}
                  sx={{
                    color: "#9e9e9e",
                    borderColor: "#e0e0e0",
                    textTransform: "none",
                    padding: "4px 16px",
                    fontSize: "16px",
                    fontWeight: 400,
                    "&:hover": {
                      borderColor: "#bdbdbd",
                    },
                  }}
                  onClick={handleOpenModal}
                >
                  Filter
                </Button>
              </Box>
            </div>
            <div
              style={{
                height: useMediaQuery("(max-width:768px)") ? "72vh" : "77vh",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    paddingTop: "24px",
                    marginBottom: "24px",
                    display: "flex",
                    padding: "2.4rem",
                    gap: "24px",
                    border:
                      currentImageIndex === index
                        ? "1.5px solid #60a487"
                        : "1px solid #eee",
                    transition: "box-shadow 0.3s ease",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleArrowClick(index)}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#60a487",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        ></div>
                        <div>
                          <h3
                            style={{
                              fontWeight: 900,
                              fontSize: "14px",
                              color: "rgba(96, 164, 135, 1)",
                            }}
                          >
                            {order.status}
                          </h3>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(56, 55, 55, 1)",
                              fontWeight: 400,
                            }}
                          >
                            {order.date}
                          </p>
                        </div>
                      </div>
                      {/* <button
                      style={{
                        border: "none",
                        color: "#000000",
                        cursor: "pointer",
                        background: "none",
                        padding: 0,
                      }}
                    > */}
                      {breakpoints.max768 !== true &&
                        (currentImageIndex === index ? (
                          <ArrowBackIosNewRoundedIcon
                            sx={{
                              fontSize: 23,
                              color: "#ad3f38",
                            }}
                          />
                        ) : (
                          <ArrowForwardIosRoundedIcon
                            sx={{
                              fontSize: 23,
                            }}
                          />
                        ))}
                    </div>
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        marginBottom: "8px",
                        color: "rgba(56, 55, 55, 1)",
                      }}
                    >
                      {order.product}
                    </h4>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "rgba(111, 111, 111, 1)",
                        fontWeight: 400,
                        marginBottom: "14px",
                        lineHeight: "21px",
                      }}
                    >
                      {order.description}
                    </p>

                    <ul style={{ paddingLeft: "15px" }}>
                      <li
                        style={{
                          fontSize: "12px",
                          color: "rgba(111, 111, 111, 1)",
                          fontWeight: 400,
                        }}
                      >
                        Exchange/Return window closed on {order.exchangeDate}
                      </li>
                    </ul>

                    <div
                      style={{
                        display: "flex",
                        marginTop: "8px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarBorder
                          key={star}
                          style={{ color: "#d1d5db", fontSize: 20 }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(111, 111, 111, 1)",
                        marginTop: "4px",
                        fontWeight: 400,
                      }}
                    >
                      Rate & Review for our artisan's masterpiece
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Box
          sx={{
            width:
              (breakpoints.max768 && "0") ||
              (breakpoints.min769Max1024 && "40%") ||
              "30%",
            display: breakpoints.max768 ? "none" : "block",
            height: "87vh",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              paddingTop: "20px",
              paddingBottom: "20px",
              marginBottom: "20px",
            }}
            src={orders[currentImageIndex].image}
            alt={orders[currentImageIndex].product}
          />
        </Box>
      </Box>
      <EditAddressModal open={isModalOpen} handleClose={handleCloseModal} />
    </>
  );
}
