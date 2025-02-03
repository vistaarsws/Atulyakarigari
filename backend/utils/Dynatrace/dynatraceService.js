// const axios = require('axios');

// const DYNATRACE_BASE_URL = 'https://<your-dynatrace-environment>.live.dynatrace.com/api/v1';
// const API_TOKEN = 'your-dynatrace-api-token';

// const fetchPerformanceMetrics = async () => {
//     try {
//         const response = await axios.get(`${DYNATRACE_BASE_URL}/metrics`, {
//             headers: {
//                 Authorization: `Api-Token ${API_TOKEN}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching Dynatrace metrics:', error);
//         throw error;
//     }
// };

// module.exports = {
//     fetchPerformanceMetrics,
// };