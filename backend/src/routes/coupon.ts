import express from 'express';
import * as couponController from '../controllers/coupon';
import * as authMiddleware from '../middlewares/auth';
import * as adminMiddleware from '../middlewares/admin';

const router = express.Router();

router.post('/', authMiddleware.protect, adminMiddleware.isAdmin, couponController.createCoupon);
router.get('/', authMiddleware.protect, couponController.getAllCoupons);
router.post('/apply', authMiddleware.protect, couponController.applyCoupon); 
router.get('/:id', authMiddleware.protect, couponController.getCoupon);
router.put('/:id', authMiddleware.protect, adminMiddleware.isAdmin, couponController.updateCoupon);
router.delete('/:id', authMiddleware.protect, adminMiddleware.isAdmin, couponController.deleteCoupon);
export default router;