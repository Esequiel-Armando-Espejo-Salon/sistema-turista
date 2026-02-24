import Promotion from '../models/promotion';
import { Request, Response } from 'express';

export const getActivePromotions = async (req: Request, res: Response) => {
  try {
    const now = new Date();

    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.status(200).json({
      status: 'success',
      data: { promotions }
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { promotion }
    });

  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ status: 'error', message: 'Promoción no encontrada' });
    }

    res.status(200).json({
      status: 'success',
      data: { promotion }
    });

  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);

    if (!promotion) {
      return res.status(404).json({ status: 'error', message: 'Promoción no encontrada' });
    }

    res.status(204).json({
      status: 'success',
      message: 'Promoción eliminada'
    });

  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};