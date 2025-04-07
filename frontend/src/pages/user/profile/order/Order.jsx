import { useEffect, useState } from "react";
import {
 
  Box,
 
  useMediaQuery,
  
} from "@mui/material";
import {
  
  Search,

  StarBorder,

} from "@mui/icons-material";
import { InputBase } from "@mui/material";

// import TEST_01 from "../../../../assets/images/order-img.png";
// import TEST_02 from "../../../../assets/images/aboutBanner.png";
// import TEST_03 from "../../../../assets/images/artistry_1.png";
// import TEST_04 from "../../../../assets/images/ourCollections_2.png";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { getAllUserOrders } from "../../../../services/user/userAPI";
import { useSelector } from "react-redux";


export default function Component() {
  // const orders = [
  //   {
  //     id: 1,
  //     status: "Delivered",
  //     date: "On Wed, 3 Apr 2024",
  //     product: "BANARSI SAARI",
  //     description:
  //       "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
  //     exchangeDate: "Wed, 10 Apr 2024",
  //     image: TEST_01,
  //   },
  //   {
  //     id: 2,
  //     status: "Delivered",
  //     date: "On Wed, 3 Apr 2024",
  //     product: "BANARSI SAARI",
  //     description:
  //       "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
  //     exchangeDate: "Wed, 10 Apr 2024",
  //     image: TEST_02,
  //   },
  //   {
  //     id: 3,
  //     status: "Delivered",
  //     date: "On Wed, 3 Apr 2024",
  //     product: "BANARSI SAARI",
  //     description:
  //       "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
  //     exchangeDate: "Wed, 10 Apr 2024",
  //     image: TEST_03,
  //   },
  //   {
  //     id: 4,
  //     status: "Delivered",
  //     date: "On Wed, 3 Apr 2024",
  //     product: "BANARSI SAARI",
  //     description:
  //       "Banarasi silk fabric is a fine quality silk variant originating from Varanasi, Uttar Pradesh. Banarasi silk has its roots deep in the rich history of India. Saree woven from silk is known as Banarasi silk Saree, which is an extremely famous fabric all over India and the world.",
  //     exchangeDate: "Wed, 10 Apr 2024",
  //     image: TEST_04,
  //   },
  // ];

  const authToken = useSelector((state) => state.auth.token);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [allOrder, setAllOrder] = useState();
  const data = {};
  const breakpoints = {
    max768: useMediaQuery("(max-width:768px)"),
    min769Max1024: useMediaQuery("((min-width:769px) and (max-width:1024px))"),
  };

  const handleArrowClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleOrderClick = (order, index) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
    handleArrowClick(index);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllUserOrders(authToken);
        setAllOrder(response.data.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);



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
            height: breakpoints.max768 ? "auto" : "90vh",
            padding: useMediaQuery("(max-width:425px)") ? "2rem" : "2rem 4rem",

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
                  alignItems: breakpoints.min769Max1024 ? "start" : "center",
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
              </Box>
            </div>
            <div
              style={{
                height: breakpoints.max768 ? "72vh" : "77vh",
                overflowY: "scroll",
                scrollbarWidth: "none",
              }}
            >
              {allOrder?.map((order, index) => (
                <div
                  key={order._id.orderId}
                  style={{
                    paddingTop: "24px",
                    marginBottom: breakpoints.max768 ? "2rem" : "24px",
                    display: "flex",
                    padding: "2.4rem",
                    gap: "24px",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease", // Add transform to transition
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOrderClick(order, index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1.5px solid #60a487"; // Border on hover
                    e.currentTarget.style.transform = "scale(.99)"; // Zoom in
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid #eee"; // Revert border
                    e.currentTarget.style.transform = "scale(1)"; // Revert zoom
                  }}
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
                            overflow: "hidden",
                          }}
                        >
                          <img
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                            }}
                            src={order.productDetails?.images[0]}
                            alt={order.productDetails?.name}
                          />
                        </div>
                        <div>
                          <h3
                            style={{
                              fontWeight: 900,
                              fontSize: "14px",
                              color: "rgba(96, 164, 135, 1)",
                            }}
                          >
                            {order.orderStatus}
                          </h3>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "rgba(56, 55, 55, 1)",
                              fontWeight: 400,
                            }}
                          >
                            {new Date(order.createdAt).toDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <h4
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        marginBottom: "8px",
                        color: "rgba(56, 55, 55, 1)",
                      }}
                    >
                      {order.productDetails?.name}
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
                      {order.productDetails?.description}
                    </p>

                    <ul style={{ paddingLeft: "15px" }}>
                      <li
                        style={{
                          fontSize: "12px",
                          color: "rgba(111, 111, 111, 1)",
                          fontWeight: 400,
                        }}
                      >
                        Exchange/Return window closed on{" "}
                        {order?.productDetails?.expectedReturnDate}
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
      </Box>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={isOrderModalOpen}
        handleClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}
