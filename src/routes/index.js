import express from 'express';
import creatorRoutes from './creator.routes.js';

const router = express.Router();

router.use('/creator', creatorRoutes);

export default router;