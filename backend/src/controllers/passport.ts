import { Response, Request } from 'express';
import Passport from '../models/passport';
import Visit from '../models/visit';
import Location from '../models/location';
import { Account } from '../models/account';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

//@route POST /api/passports

export const createPassport = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

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

// @route GET /api/passports
export const getAllPassports = async (req: AuthRequest, res: Response) => {
  try {
    const passports = await Passport.find({ userId: req.user?.id });

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

// @route GET /api/passports/:id

export const getPassport = async (req: AuthRequest, res: Response) => {
  try {
    const passport = await Passport.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!passport) {
      return res.status(404).json({ status: 'error', message: 'Passport not found' });
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

// @route PUT /api/passports/:id

export const updatePassport = async (req: AuthRequest, res: Response) => {
  try {
    const passport = await Passport.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!passport) {
      return res.status(404).json({ status: 'error', message: 'Passport not found' });
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

// @route DELETE /api/passports/:id

export const deletePassport = async (req: AuthRequest, res: Response) => {
  try {
    const passport = await Passport.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id,
    });

    if (!passport) {
      return res.status(404).json({ status: 'error', message: 'Passport not found' });
    }

    res.status(204).json({
      status: 'success',
      message: 'Passport deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

import Reservation from '../models/reservation';

export const getMyReservations = async (req: any, res: any) => {
  try {
    const reservations = await Reservation.find({ touristId: req.user?.id })
      .populate('locationId', 'locationName address images')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: reservations.length,
      data: { reservations }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
// @route GET /api/passports/stats

export const getPassportStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const tourist = await Account.findById(req.user.id).select('name');
    if (!tourist) {
      return res.status(404).json({ status: 'error', message: 'Tourist not found' });
    }

    const totalPlaces = await Location.countDocuments({ active: true });

    const visitedPlaces = await Visit.distinct('locationId', { 
      touristId: req.user.id, 
      visited: true 
    });
    const visitedCount = visitedPlaces.length;

    const percentage = totalPlaces === 0 ? 0 : Math.round((visitedCount / totalPlaces) * 100);

    res.status(200).json({
      status: 'success',
      data: {
        tourist: tourist.name,
        stats: {
          totalPlaces,
          visited: visitedCount,
          percentage
        }
      }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};