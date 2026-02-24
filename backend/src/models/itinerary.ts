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
    required: [true, "El título del itinerario es requerido"],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, "El destino es requerido"],
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
    required: [true, "La fecha de inicio es requerida"],
  },
  endDate: {
    type: Date,
    required: [true, "La fecha de fin es requerida"],
  },
  activities: [
    {
      name: {
        type: String,
        required: [true, "El nombre de la actividad es requerido"],
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
