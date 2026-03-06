import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  touristId: mongoose.Schema.Types.ObjectId;
  locationId: mongoose.Schema.Types.ObjectId;
  date: Date;
  time: string;
  numberOfGuests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  stripePaymentIntentId?: string;
  stripeClientSecret?: string;
  confirmationCode?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>({
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  numberOfGuests: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  stripePaymentIntentId: String,
  stripeClientSecret: String,
  confirmationCode: { type: String, unique: true, sparse: true },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model<IReservation>('Reservation', reservationSchema);