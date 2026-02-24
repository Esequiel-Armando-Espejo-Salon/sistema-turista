import express from 'express';
import * as passportController from '../controllers/passport';
import * as authMiddleware from '../middlewares/auth';

const router = express.Router();

router.post('/', authMiddleware.protect, passportController.createPassport);
router.get('/', authMiddleware.protect, passportController.getAllPassports);
router.get('/:id', authMiddleware.protect, passportController.getPassport);
router.put('/:id', authMiddleware.protect, passportController.updatePassport);
router.delete('/:id', authMiddleware.protect, passportController.deletePassport);

export default router;