import { Response } from 'express';
import Passport from '../models/passport';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

/**
 * Create Passport
 */
export const createPassport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado',
      });
    }

    // Automatically assign the userId from the authenticated user
    req.body.userId = req.user.id;

    const passport = await Passport.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { passport },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Retrieve all passports of the logged-in user
 */
export const getAllPassports = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado',
      });
    }

    const passports = await Passport.find({
      userId: req.user.id,
    });

    res.status(200).json({
      status: 'success',
      results: passports.length,
      data: { passports },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Obtain a specific passport (only if it belongs to the user)
 */
export const getPassport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado',
      });
    }

    const passport = await Passport.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!passport) {
      return res.status(404).json({
        status: 'error',
        message: 'Passport no encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { passport },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Update passport (only if it belongs to the user)
 */
export const updatePassport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado',
      });
    }

    const passport = await Passport.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!passport) {
      return res.status(404).json({
        status: 'error',
        message: 'Passport no encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { passport },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

/**
 * Delete passport (only if it belongs to the user)
 */
export const deletePassport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado',
      });
    }

    const passport = await Passport.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!passport) {
      return res.status(404).json({
        status: 'error',
        message: 'Passport no encontrado',
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Passport eliminado correctamente',
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};
