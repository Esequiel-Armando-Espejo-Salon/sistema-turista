import mongoose, { Schema, Document } from 'mongoose';

interface IDiscountUsage extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  couponId?: mongoose.Schema.Types.ObjectId;
  usedAt: Date;
}

const discountUsageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon'
  },
  usedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model<IDiscountUsage>('DiscountUsage', discountUsageSchema);