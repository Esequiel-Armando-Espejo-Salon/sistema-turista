import express from 'express';
import * as accountController from '../controllers/account';
import * as authMiddleware from '../middlewares/auth';
import { body } from 'express-validator';
const router = express.Router();

const registerValidations = [
    body('name').notEmpty().withMessage('El nombre es requerido').trim(),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('telephone').isNumeric().withMessage('El teléfono debe ser numérico').isLength({ min: 8, max: 12 }).withMessage('El teléfono debe tener entre 8 y 12 dígitos')
];

router.post('/register', registerValidations, accountController.register);
router.post('/login', accountController.login);
router.get('/me', authMiddleware.protect, accountController.getMe);
router.put('/me', authMiddleware.protect, accountController.updateMe);
router.delete('/me', authMiddleware.protect, accountController.deleteMe);

router.get('/', authMiddleware.protect, accountController.getAllAccounts);
router.get('/:id', authMiddleware.protect, accountController.getAccount);
router.put('/:id', authMiddleware.protect, accountController.updateAccount);
router.delete('/:id', authMiddleware.protect, accountController.deleteAccount);

export default router;