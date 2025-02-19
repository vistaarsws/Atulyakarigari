import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OrderStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

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
