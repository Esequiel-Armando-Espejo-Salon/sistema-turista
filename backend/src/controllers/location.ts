import { Request, Response } from 'express';
import Location from '../models/location';
import Visit from '../models/visit';

export const searchLocations = async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius, category, name } = req.query;

    let query: any = { active: true };

    if (name) {
      query.locationName = { $regex: name as string, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (lat && lng) {
      const radiusInMeters = radius ? parseInt(radius as string) : 5000; // default 5km
      query.startLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)] 
          },
          $maxDistance: radiusInMeters
        }
      };
    }

    const locations = await Location.find(query).select('-reviews'); 

    res.status(200).json({
      status: 'success',
      results: locations.length,
      data: { locations }
    });

  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getLocationDetail = async (req: Request, res: Response) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ status: 'error', message: 'Location not found' });
    }

    res.status(200).json({
      status: 'success',
      data: { location }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addReview = async (req: any, res: Response) => {
  try {
    const { rating, comment, images } = req.body;
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ status: 'error', message: 'Location not found' });
    }

    const newReview = {
      touristId: req.user.id,
      touristName: req.user.name || 'Tourist',
      rating: Number(rating),
      comment,
      images,
      createdAt: new Date()
    };

    location.reviews.push(newReview);

    location.ratingQuantity = location.reviews.length;
    const sum = location.reviews.reduce((acc: number, item: any) => item.rating + acc, 0);
    location.ratingAverage = sum / location.reviews.length;

    await location.save();

    res.status(201).json({
      status: 'success',
      message: 'Review added successfully',
      data: { review: newReview, newRating: location.ratingAverage }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const markVisit = async (req: any, res: Response) => {
  try {
    const { locationId, rating, comment } = req.body;

    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).json({ status: 'error', message: 'Location not found' });
    }

    const visit = await Visit.create({
      touristId: req.user.id,
      locationId,
      rating,
      comment
    });

    location.visitCount += 1;
    await location.save();

    res.status(201).json({
      status: 'success',
      message: 'Visit registered successfully in your passport',
      data: { visit }
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};