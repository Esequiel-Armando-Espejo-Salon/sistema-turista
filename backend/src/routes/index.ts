import express from 'express';
import accountRoutes from './account';
import couponRoutes from './coupon';
import itineraryRoutes from './itinerary';
import passportRoutes from './passport';
import promotionRoutes from './promotion';
import locationRoutes from './location';
import reservationRoutes from './reservation';

const router = express.Router();

router.use('/promotions', promotionRoutes);
router.use('/accounts', accountRoutes);
router.use('/coupons', couponRoutes);
router.use('/itineraries', itineraryRoutes);
router.use('/passports', passportRoutes);
router.use('/locations', locationRoutes);
router.use('/reservations', reservationRoutes);

export default router;