import { useSearchParams } from "react-router-dom";
import { createOrder } from "../../../services/user/userAPI";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OrderStatus = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");

  const OrderCreate = async () => {
    try {
      const payload = { }
      
      const response = await createOrder(payload);

      if (!response.ok) throw new Error("Order creation failed");

      const data = await response.json();
      alert("✅ Order created successfully!");
      navigate(`/order/${data.orderId}`); 
    } catch (error) {
      console.error("Error creating order:", error);
      alert("⚠️ Order creation failed. Please contact support.");
      navigate("/view-cart");
    }
  };

  useEffect(() => {
    if (status === "success") {
      OrderCreate();
    } else {
      setTimeout(() => navigate("/"), 5000);
    }
  }, [status, navigate]);

  return (
    <div>
      {status === "success" ? (
        <>
          <h2>✅ Payment Successful</h2>
          <p>Your payment was successful! Creating your order...</p>
        </>
      ) : (
        <>
          <h2>❌ Payment Failed</h2>
          <p>Oops! Your payment was not successful.</p>
          <p>You will be redirected to the home page shortly.</p>
          <button onClick={() => navigate("/")}>🏠 Return to Home</button>
        </>
      )}
    </div>
  );
}
export default OrderStatus;
