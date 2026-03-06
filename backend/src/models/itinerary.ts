import mongoose, { Schema, Document } from "mongoose";

interface IItinerary extends Document {
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  activities: [
    {
      name: string;
      description?: string;
      location?: string;
      time?: Date;
    },
  ];
  userId: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const itinerarySchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, "The itinerary title is required"],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, "The destination is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  finalPrice: {
    type: Number,
  },
  appliedDiscount: {
    type: Number,
    default: 0,
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
  },
  startDate: {
    type: Date,
    required: [true, "A start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "The end date is required"],
  },
  activities: [
    {
      name: {
        type: String,
        required: [true, "The activity name is required"],
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      time: Date,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IItinerary>("Itinerary", itinerarySchema);
