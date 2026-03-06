import express from 'express';
import * as promotionController from '../controllers/promotion';
import * as authMiddleware from '../middlewares/auth';
import * as adminMiddleware from '../middlewares/admin';

const router = express.Router();

router.get('/', authMiddleware.protect, promotionController.getActivePromotions);
router.post('/', authMiddleware.protect, adminMiddleware.isAdmin, promotionController.createPromotion);
router.put('/:id', authMiddleware.protect, adminMiddleware.isAdmin, promotionController.updatePromotion);
router.delete('/:id', authMiddleware.protect, adminMiddleware.isAdmin, promotionController.deletePromotion);

export default router;