import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createOrder, checkStatus } from "../../../services/user/userAPI";

const PaymentSuccess = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentId = queryParams.get("paymentId");

    const verifyPayment = async () => {
      try {
        const response = await checkStatus(paymentId);

        if (response.data.success) {
          const orderData = JSON.parse(localStorage.getItem("orderData"));
          const selectedAddressID = JSON.parse(
            localStorage.getItem("selectedAddressID")
          );

          const payload = {
            orderData,
            selectedAddressID,
          };

          const OrderResponse = await createOrder(payload);
          console.log("OrderResponse", OrderResponse);

          if (OrderResponse.data.success) {
            setMessage("Payment successful! Your order has been placed.");
          } else {
            return setMessage(
              "Payment successful! but unable to create order"
            );
          }
        } else {
          setMessage("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        setMessage("Error verifying payment. Please try again.");
        console.error("Payment verification error:", error);
      }
    };

    if (paymentId) {
      verifyPayment();
    }
  }, [location]);

  return (
    <div>
      <h2>{message}</h2>
    </div>
  );
};

export default PaymentSuccess;
