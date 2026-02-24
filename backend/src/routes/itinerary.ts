import express from 'express';
import * as itineraryController from '../controllers/itinerary';
import * as authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/', authMiddleware.protect, itineraryController.createItinerary);
router.get('/', authMiddleware.protect, itineraryController.getAllItineraries);
router.get('/:id', authMiddleware.protect, itineraryController.getItinerary);
router.put('/:id', authMiddleware.protect, itineraryController.updateItinerary);
router.delete('/:id', authMiddleware.protect, itineraryController.deleteItinerary);

export default router;