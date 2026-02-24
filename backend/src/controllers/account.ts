import { Account } from '../models/account';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sendWelcomeEmail } from '../Utils/EmailService'; 

dotenv.config();

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const generateToken = (id: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const expiresIn: SignOptions['expiresIn'] =
    (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '3d';

  return jwt.sign(
    { id },
    jwtSecret,
    { expiresIn }
  );
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user._id.toString());

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  try {
    const { name, email, password, telephone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const account = await Account.create({
      name,
      email,
      password: hashedPassword,
      telephone,
    });

    try {
      await sendWelcomeEmail(account.email, account.name); 
    } catch (err) {
      console.error('Error sending email:', err);
    }

    createSendToken(account, 201, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error creating account' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide your email and password.',
      });
    }

    const account = await Account.findOne({ email }).select('+password');

    if (!account || !(await bcrypt.compare(password, account.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    createSendToken(account, 200, res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error logging in' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const account = await Account.findById(req.user?.id);

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { account },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error getting user' });
  }
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, telephone } = req.body;

    const account = await Account.findByIdAndUpdate(
      req.user?.id,
      { name, email, telephone },
      { new: true, runValidators: true }
    );

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { account },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating user' });
  }
};

export const deleteMe = async (req: AuthRequest, res: Response) => {
  try {
    await Account.findByIdAndDelete(req.user?.id);

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error deleting user' });
  }
};

export const getAllAccounts = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission',
      });
    }

    const accounts = await Account.find();

    res.status(200).json({
      status: 'success',
      data: { accounts },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error getting accounts' });
  }
};

export const getAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission',
      });
    }

    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { account },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error getting account' });
  }
};

export const updateAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission',
      });
    }

    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!account) {
      return res.status(404).json({
        status: 'error',
        message: 'Account not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { account },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error updating account' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission',
      });
    }

    await Account.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error deleting account' });
  }
};