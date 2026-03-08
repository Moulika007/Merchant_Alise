import express from 'express';
import { getSmartRecommendations, getDemandPrediction } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/analytics/recommendations', getSmartRecommendations);
router.post('/analytics/demand-prediction', getDemandPrediction);

export default router;
