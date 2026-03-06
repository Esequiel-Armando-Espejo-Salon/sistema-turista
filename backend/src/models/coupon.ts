import mongoose, { Schema, Document } from 'mongoose';


interface ICoupon extends Document {
    code: string;
    discount: number;
    expirationDate: Date;
    usageLimit: number;
    usedCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const couponSchema: Schema = new Schema({
    code: {
        type: String,
        required: [true, 'The coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discount: {
        type: Number,
        required: [true, 'The discount is required'],
        min: [0, 'The discount cannot be negative'],
        max: [100, 'The discount cannot be greater than 100']
    },
    expirationDate: {
        type: Date,
        required: [true, 'The expiration date is required']
    },
    usageLimit: {
        type: Number,
        default: 1,
        min: [0, 'The usage limit cannot be negative']
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'The used count cannot be negative']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model<ICoupon>('Coupon', couponSchema);