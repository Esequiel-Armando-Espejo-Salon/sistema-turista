import express from "express";
import * as accountController from "../controllers/account";
import * as authMiddleware from "../middlewares/auth";
import * as adminMiddleware from "../middlewares/admin";
import { body } from "express-validator";

const router = express.Router();

/*
 validation
*/
const registerValidations = [
  body("name").notEmpty().withMessage("The name is required").trim(),

  body("email")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("The password must have at least 8 characters")
    .matches(/[A-Z]/)
    .withMessage("Must contain an uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Must contain a number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Must contain a symbol"),

  body("telephone")
    .isNumeric()
    .withMessage("The phone number must be numeric")
    .isLength({ min: 8, max: 12 })
    .withMessage("The phone number must have between 8 and 12 digits"),
];

/*
public
*/

router.post("/register", registerValidations, accountController.register);

router.post("/login", accountController.login);
router.post("/google", accountController.googleLogin);
router.post("/facebook", accountController.facebookLogin);

/*
 rutes protected bearer token
*/

router.get("/me", authMiddleware.protect, accountController.getMe);

router.put("/me", authMiddleware.protect, accountController.updateMe);

router.delete("/me", authMiddleware.protect, accountController.deleteMe);

/*
  ADMIN
*/

router.get(
  "/",
  authMiddleware.protect,
  adminMiddleware.isAdmin,
  accountController.getAllAccounts,
);

router.get(
  "/:id",
  authMiddleware.protect,
  adminMiddleware.isAdmin,
  accountController.getAccount,
);

router.put(
  "/:id",
  authMiddleware.protect,
  adminMiddleware.isAdmin,
  accountController.updateAccount,
);

router.delete(
  "/:id",
  authMiddleware.protect,
  adminMiddleware.isAdmin,
  accountController.deleteAccount,
);

export default router;

/*
import express from 'express';
import * as accountController from '../controllers/account';
import * as authMiddleware from '../middlewares/auth';
import * as adminMiddleware from '../middlewares/admin';
import { body } from 'express-validator';

const router = express.Router();

const registerValidations = [
  body('name').notEmpty().withMessage('El nombre es requerido').trim(),
  body('email').isEmail().withMessage('Debe ser un correo electrónico válido').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telephone')
    .isNumeric()
    .withMessage('El teléfono debe ser numérico')
    .isLength({ min: 8, max: 12 })
    .withMessage('El teléfono debe tener entre 8 y 12 dígitos'),
];

//  Públi
router.post('/register', registerValidations, accountController.register);

//  Login required Bearer
router.post('/login', accountController.login);

// 
router.get('/me', authMiddleware.protect, accountController.getMe);
router.put('/me', authMiddleware.protect, accountController.updateMe);
router.delete('/me', authMiddleware.protect, accountController.deleteMe);

//  admin
router.get('/', authMiddleware.protect, adminMiddleware.isAdmin, accountController.getAllAccounts);
router.get('/:id', authMiddleware.protect, adminMiddleware.isAdmin, accountController.getAccount);
router.put('/:id', authMiddleware.protect, adminMiddleware.isAdmin, accountController.updateAccount);
router.delete('/:id', authMiddleware.protect, adminMiddleware.isAdmin, accountController.deleteAccount);

export default router;*/
