import { useSearchParams } from "react-router-dom";
import { createOrder } from "../../../services/user/userAPI";

const OrderStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const createOrderHandler = async () => {
    try {
      const orderData = JSON.parse(localStorage.getItem("orderData"));
      const response = await createOrder(orderData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {status === "COMPLETED" ? (
        <h2>✅ Payment Successful! Thank you for your order.</h2>
      ) : (
        <h2>❌ Payment Failed! Please try again.</h2>
      )}
    </div>
  );
};

export default OrderStatus;
