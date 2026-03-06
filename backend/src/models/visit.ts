import mongoose, { Schema, Document } from 'mongoose';

export interface IVisit extends Document {
  touristId: mongoose.Schema.Types.ObjectId;
  locationId: mongoose.Schema.Types.ObjectId;
  visited: boolean;
  rating?: number;
  comment?: string;
  visitDate: Date;
  createdAt: Date;
}

const visitSchema = new Schema<IVisit>({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  visited: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String,
  visitDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IVisit>('Visit', visitSchema);