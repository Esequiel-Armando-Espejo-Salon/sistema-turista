import Itinerary from '../models/itinerary';
import Promotion from '../models/promotion';
import Coupon from '../models/coupon';
import DiscountUsage from '../models/discountUsage';
import { Request, Response } from 'express';

export const createItinerary = async (req: any, res: Response) => {
  try {
    const { price, destination, couponCode } = req.body;

    if (!price) {
      return res.status(400).json({
        status: 'error',
        message: 'El precio es obligatorio'
      });
    }

    let finalPrice = price;
    let appliedDiscount = 0;
    let appliedCouponId = null;
    let totalDiscount = 0;

    const now = new Date();

    //
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $or: [
        { destination: destination },
        { destination: { $exists: false } }
      ]
    });

    if (promotions.length > 0) {
      totalDiscount += promotions[0].discountPercentage;
    }

    //
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon) {
        return res.status(404).json({
          status: 'error',
          message: 'Cupón inválido'
        });
      }

      if (coupon.expirationDate < new Date()) {
        return res.status(400).json({
          status: 'error',
          message: 'Cupón expirado'
        });
      }

      if (coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({
          status: 'error',
          message: 'Cupón agotado'
        });
      }

      const alreadyUsed = await DiscountUsage.findOne({
        userId: req.user.id,
        couponId: coupon._id
      });

      if (alreadyUsed) {
        return res.status(400).json({
          status: 'error',
          message: 'Ya utilizaste este cupón'
        });
      }

      totalDiscount += coupon.discount;
      appliedCouponId = coupon._id;

      coupon.usedCount += 1;
      await coupon.save();

      await DiscountUsage.create({
        userId: req.user.id,
        couponId: coupon._id
      });
    }

    // 🔥 Limitar descuento máximo a 100%
    if (totalDiscount > 100) totalDiscount = 100;

    // 🔥 Calcular precio final UNA sola vez
    finalPrice = price - (price * totalDiscount) / 100;
    appliedDiscount = totalDiscount;

    const itinerary = await Itinerary.create({
      ...req.body,
      userId: req.user.id,
      finalPrice,
      appliedDiscount,
      couponId: appliedCouponId
    });

    res.status(201).json({
      status: 'success',
      data: { itinerary }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getAllItineraries = async (req: any, res: Response) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user.id });

    res.status(200).json({
      status: 'success',
      data: { itineraries }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getItinerary = async (req: any, res: Response) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerario no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { itinerary }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateItinerary = async (req: any, res: Response) => {
  try {
    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerario no encontrado'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { itinerary }
    });

  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteItinerary = async (req: any, res: Response) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!itinerary) {
      return res.status(404).json({
        status: 'error',
        message: 'Itinerario no encontrado'
      });
    }

    res.status(204).json({
      status: 'success',
      message: 'Itinerario eliminado'
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};