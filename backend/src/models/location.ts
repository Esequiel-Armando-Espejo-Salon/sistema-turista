import mongoose, { Schema, Document } from 'mongoose';

interface IReview {
  touristId: mongoose.Schema.Types.ObjectId;
  touristName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

export interface ILocation extends Document {
  accountId?: mongoose.Schema.Types.ObjectId;
  locationName: string;
  summary?: string;
  longDescription?: string;
  category: string;
  subcategory?: string;
  images: { url: string; caption?: string; isPrimary: boolean }[];
  startLocation: {
    type: string;
    coordinates: number[];
  };
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  price?: { min: number; max: number; currency: string };
  hours?: {
    monday?: string; tuesday?: string; wednesday?: string;
    thursday?: string; friday?: string; saturday?: string; sunday?: string;
  };
  amenities: string[];
  contact?: {
    website?: string; whatsapp?: string; telephone?: string;
    email?: string; facebook?: string; instagram?: string;
  };
  reviews: IReview[];
  ratingAverage: number;
  ratingQuantity: number;
  visitCount: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema<ILocation>({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  locationName: { type: String, required: [true, 'Location name is required'], trim: true },
  summary: String,
  longDescription: String,
  category: { type: String, required: true },
  subcategory: String,
  images:[{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  startLocation: {
    type: { type: String, default: 'Point', enum: ['Point'] },
    coordinates: [Number]
  },
  address: String,
  city: String,
  state: String,
  country: String,
  price: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'MXN' }
  },
  hours: {
    monday: String, tuesday: String, wednesday: String,
    thursday: String, friday: String, saturday: String, sunday: String
  },
  amenities: [String],
  contact: {
    website: String, whatsapp: String, telephone: String,
    email: String, facebook: String, instagram: String
  },
  reviews:[{
    touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    touristName: String,
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now }
  }],
  ratingAverage: { type: Number, default: 0, min: 0, max: 5 },
  ratingQuantity: { type: Number, default: 0 },
  visitCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

locationSchema.index({ startLocation: '2dsphere' });

export default mongoose.model<ILocation>('Location', locationSchema);