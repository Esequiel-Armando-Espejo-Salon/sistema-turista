import express from 'express';
import accountRoutes from './account';
import couponRoutes from './coupon';
import itineraryRoutes from './itinerary';
import passportRoutes from './passport';
import promotionRoutes from './promotion';

const router = express.Router();

router.use('/promotions', promotionRoutes);
router.use('/accounts', accountRoutes);
router.use('/coupons', couponRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/passports', passportRoutes);

export default router;