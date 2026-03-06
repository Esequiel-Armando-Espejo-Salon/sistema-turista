import express from 'express';
import * as passportController from '../controllers/passport';
import * as authMiddleware from '../middlewares/auth';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/stats', authMiddleware.protect, passportController.getPassportStats);
router.post('/', passportController.createPassport);
router.get('/', passportController.getAllPassports);
router.get('/:id', passportController.getPassport);
router.put('/:id', passportController.updatePassport);
router.delete('/:id', passportController.deletePassport);

export default router;