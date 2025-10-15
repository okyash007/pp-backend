import express from 'express';
import creatorRoutes from './creator.routes.js';
import configRoutes from './config.routes.js';
import analyticsRoutes from './analytics.routes.js';
import tipRoutes from './tip.routes.js';
import uploadRoutes from './upload.routes.js';

const router = express.Router();

router.use('/creator', creatorRoutes);
router.use('/config', configRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/tip', tipRoutes);
router.use('/upload', uploadRoutes);

export default router;