// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import axios from "axios";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [searchParams] = useSearchParams();
//   const orderId = searchParams.get("order_id");

//   useEffect(() => {
//     if (orderId) {
//       // ✅ Fetch order details from backend
//       axios
//         .get(`http://localhost:8000/api/v1/orders/${orderId}`)
//         .then((res) => setOrder(res.data))
//         .catch((err) => console.error("❌ Error fetching order:", err));
//     }
//   }, [orderId]);

//   return (
//     <div>
//       <h2>🎉 Payment Successful!</h2>
//       {order ? (
//         <div>
//           <p>🆔 Order ID: {order.orderId}</p>
//           <p>💰 Amount: ₹{order.totalAmount}</p>
//           <p>📦 Status: {order.orderStatus}</p>
//           <h3>🛍️ Items Purchased:</h3>
//           <ul>
//             {order.products.map((item, index) => (
//               <li key={index}>
//                 {item.name} - ₹{item.price} × {item.quantity} = ₹{item.totalPrice}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>Loading order details...</p>
//       )}
//       <button onClick={() => navigate("/")}>🏠 Go to Home</button>
//     </div>
//   );
// };

// export default PaymentSuccess;
