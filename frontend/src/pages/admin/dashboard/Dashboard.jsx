import React from "react";

export default function Dashboard() {
  return (
    <div>
      <p>Dashboard</p>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import axios from "axios";

// const AdminDashboard = () => {
//   const [metrics, setMetrics] = useState(null);

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const response = await axios.get("/api/admin/metrics");
//         setMetrics(response.data);
//       } catch (error) {
//         console.error("Error fetching Dynatrace metrics:", error);
//       }
//     };

//     fetchMetrics();
//   }, []);


//   const [problems, setProblems] = useState([]);

//   useEffect(() => {
//     axios.get("/api/admin/problems").then((res) => {
//       setProblems(res.data?.problems || []);
//     });
//   }, []);

//   return (
//     <div>
//       <h2>Performance Metrics</h2>
//       {metrics ? (
//         <ul>
//           <li>Response Time: {metrics?.data[0]?.value} ms</li>
//           <li>Error Rate: {metrics?.data[1]?.value} %</li>
//         </ul>
//       ) : (
//         <p>Loading metrics...</p>
//       )}
//     </div>
//   );
// };


// // const runSyntheticTest = async () => {
// //   try {
// //     const response = await axios.post("/api/admin/synthetic-test");
// //     alert("Synthetic Test Started: " + response.data.name);
// //   } catch (error) {
// //     alert("Error running test.");
// //   }
// // };
// {/* <button onClick={runSyntheticTest}>Run Checkout Test</button> */}
// export default AdminDashboard;
