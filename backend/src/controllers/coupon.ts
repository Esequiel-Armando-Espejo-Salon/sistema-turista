import Coupon from '../models/coupon';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import DiscountUsage from '../models/discountUsage';

dotenv.config(); // Load the environment variables from the .env file

// @desc Create a new coupon

    // @route POST /api/coupons
// @access Private (Admin)
export const createCoupon = async (req: Request, res: Response) => { // Export individually
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                coupon,
            },
        });
    } catch (error: any) { // Type 'error' as 'any' or 'Error'
        res.status(400).json({ status: 'error', message: 'Error creating coupon', error: error.message });
    }
};

// @desc Get all coupons

// @route GET /api/coupons

// @access Private
export const getAllCoupons = async (req: Request, res: Response) => { // Export individually
    try {
        const coupons = await Coupon.find();
        res.status(200).json({
            status: 'success',
            data: {
                coupons,
            },
        });
    } catch (error: any) { // Type 'error' as ............
        res.status(500).json({ status: 'error', message: 'Error getting coupons', error: error.message });
    }
};

// @desc Get a coupon by ID

// @route GET /api/coupons/:id

// @access Private
export const getCoupon = async (req: Request, res: Response) => { // Exportar individualmente
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ status: 'error', message: 'Coupon not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                coupon,
            },
        });
    } catch (error: any) { // Type 'error' as ......
        res.status(500).json({ status: 'error', message: 'Error getting coupon', error: error.message });
    }
};

// @desc Update a coupon by ID
// @route PUT /api/coupons/:id
// @access Private (Admin)
export const updateCoupon = async (req: Request, res: Response) => { // Exportar individualmente
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!coupon) {
            return res.status(404).json({ status: 'error', message: 'Coupon not found' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                coupon,
            },
        });
    } catch (error: any) {// Type 'error' as ............
        res.status(400).json({ status: 'error', message: 'Error updating coupon', error: error.message });
    }
};

// @desc Delete a coupon by ID
// @route DELETE /api/coupons/:id
// @access Private (Admin)
export const deleteCoupon = async (req: Request, res: Response) => { // Export individually
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ status: 'error', message: 'Coupon not found' });
        }
        res.status(204).json({ status: 'success', message: 'Coupon deleted' });
    } catch (error: any) { // Type..........
        res.status(500).json({ status: 'error', message: 'Error deleting coupon', error: error.message });
    }
};




// @desc Apply a coupon
// @route POST /api/coupons/apply
// @access Private
export const applyCoupon = async (req: any, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ status: 'error', message: 'Invalid coupon' });
    }

    if (coupon.expirationDate < new Date()) {
      return res.status(400).json({ status: 'error', message: 'Coupon expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ status: 'error', message: 'Coupon usage limit reached' });
    }

    const alreadyUsed = await DiscountUsage.findOne({
      userId,
      couponId: coupon._id
    });

    if (alreadyUsed) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already used this coupon'
      });
    }

    coupon.usedCount += 1;
    await coupon.save();

    await DiscountUsage.create({
      userId,
      couponId: coupon._id
    });

    res.status(200).json({
      status: 'success',
      data: { discount: coupon.discount }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};