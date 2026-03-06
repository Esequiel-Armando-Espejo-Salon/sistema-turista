import mongoose, { Schema, Document } from 'mongoose';

interface IPromotion extends Document {
  name: string;
  description?: string;
  discountPercentage: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

const promotionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPromotion>('Promotion', promotionSchema);