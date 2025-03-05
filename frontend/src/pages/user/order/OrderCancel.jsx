import { Link } from "react-router-dom";

const OrderCancel = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>❌ Payment Canceled</h2>
      <p style={styles.text}>
        You have canceled your payment. If this was a mistake, you can try again.
      </p>
      <Link to="/view-cart" style={styles.button}>
        Return to Cart
      </Link>
    </div>
  );
};

// Inline styles for quick styling
const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    color: "red",
  },
  text: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
  },
};

export default OrderCancel;
