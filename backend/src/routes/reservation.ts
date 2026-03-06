import express from 'express';
import * as reservationController from '../controllers/reservation';
import * as authMiddleware from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', reservationController.createReservation);
router.post('/:id/payment', reservationController.processPayment);
router.post('/:id/confirm', reservationController.confirmReservation);
router.get('/', reservationController.getMyReservations);

export default router;