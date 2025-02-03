// import express from "express";
// import getMatrics from "../controllers/metrics.controller.js";

// import dynatraceService from "../services/dynatrace.service.js";
// import { auth } from "../middlewares/auth.middleware.js";


// const router = express.Router();
// router.use(auth);

// router.get('/metrics', async (req, res) => {
//     try {
//         const metrics = await dynatraceService.fetchPerformanceMetrics();
//         res.json(metrics);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch metrics' });
//     }
// });

// module.exports = router;