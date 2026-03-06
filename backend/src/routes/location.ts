import express from 'express';
import * as locationController from '../controllers/location';
import * as authMiddleware from '../middlewares/auth';

const router = express.Router();

router.get('/search', locationController.searchLocations);

router.get('/:id/detail', authMiddleware.protect, locationController.getLocationDetail);
router.post('/:id/review', authMiddleware.protect, locationController.addReview);
router.post('/visit', authMiddleware.protect, locationController.markVisit);

export default router;