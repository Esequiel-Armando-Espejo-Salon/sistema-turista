import { Response } from 'express';
import Reservation from '../models/reservation';
import Location from '../models/location';
import { StripeService } from '../service/Stripe';
import { sendReservationConfirmationEmail } from '../Utils/EmailService';
import { Account } from '../models/account';

const stripeService = new StripeService();

const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const createReservation = async (req: any, res: Response) => {
    try {
        const { locationId, date, time, numberOfGuests, notes } = req.body;

        const location = await Location.findById(locationId);
        if (!location) {
            return res.status(404).json({ status: 'error', message: 'Location not found' });
        }

        const pricePerPerson = location.price?.min || 100;
        const totalAmount = pricePerPerson * numberOfGuests;

        const paymentIntent = await stripeService.createPayment(totalAmount, {
            touristId: req.user.id,
            locationId: locationId
        });

        const reservation = await Reservation.create({
            touristId: req.user.id,
            locationId,
            date,
            time,
            numberOfGuests,
            totalAmount,
            notes,
            stripePaymentIntentId: paymentIntent.id,
            stripeClientSecret: paymentIntent.client_secret
        });

        res.status(201).json({
            status: 'success',
            data: { 
                reservation,
                clientSecret: paymentIntent.client_secret 
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const processPayment = async (req: any, res: Response) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, touristId: req.user.id });
        
        if (!reservation) {
            return res.status(404).json({ status: 'error', message: 'Reservation not found' });
        }

        reservation.paymentStatus = 'completed';
        await reservation.save();

        res.status(200).json({
            status: 'success',
            message: 'Payment processed successfully',
            data: { reservation }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const confirmReservation = async (req: any, res: Response) => {
    try {
        const reservation = await Reservation.findOne({ _id: req.params.id, touristId: req.user.id })
                                             .populate('locationId', 'locationName'); 

        if (!reservation) {
            return res.status(404).json({ status: 'error', message: 'Reservation not found' });
        }

        if (reservation.paymentStatus !== 'completed') {
            return res.status(400).json({ status: 'error', message: 'Payment has not been completed' });
        }

        const code = generateConfirmationCode();
        reservation.status = 'confirmed';
        reservation.confirmationCode = code;
        await reservation.save();

        const tourist = await Account.findById(req.user.id);
        
        if (tourist) {
            const locationData: any = reservation.locationId;
            const formattedDate = new Date(reservation.date).toLocaleDateString('en-US');
            
            await sendReservationConfirmationEmail(
                tourist.email, 
                tourist.name, 
                locationData.locationName,
                code,
                formattedDate,
                reservation.time
            );
        }

        res.status(200).json({
            status: 'success',
            data: { 
                reservation,
                confirmationCode: code 
            }
        });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getMyReservations = async (req: any, res: Response) => {
    try {
        const reservations = await Reservation.find({ touristId: req.user.id })
                                              .populate('locationId', 'locationName images address')
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