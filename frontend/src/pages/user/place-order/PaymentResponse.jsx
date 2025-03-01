import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { paymentResponse } from "../../../services/user/userAPI";

const PaymentResponse = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const processPaymentResponse = async () => {
      const encResp = searchParams.get("encResp");

      if (encResp) {
        try {
          const response = await paymentResponse(encResp);
          window.location.href = response.data.redirectUrl;
        } catch (error) {
          console.error("Error processing payment response:", error);
          alert("Error processing payment. Please contact support.");
        }
      }
    };

    processPaymentResponse();
  }, [searchParams]);

  return (
    <div style={styles.container}>
      <h2>Processing Payment...</h2>
    </div>
  );
};

const styles = { container: { textAlign: "center", marginTop: "50px" } };

export default PaymentResponse;
