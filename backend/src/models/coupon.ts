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
        required: [true, 'El código del cupón es requerido'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discount: {
        type: Number,
        required: [true, 'El descuento es requerido'],
        min: [0, 'El descuento no puede ser negativo'],
        max: [100, 'El descuento no puede ser mayor a 100']
    },
    expirationDate: {
        type: Date,
        required: [true, 'La fecha de expiración es requerida']
    },
    usageLimit: {
        type: Number,
        default: 1,
        min: [0, 'El límite de uso no puede ser negativo']
    },
    usedCount: {
        type: Number,
        default: 0,
        min: [0, 'El contador de uso no puede ser negativo']
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