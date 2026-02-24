import mongoose, { Document, Schema } from 'mongoose'

 interface AccountInterface extends Document {
    name: string
    telephone: number
    email: string
    password: string
    role: string
    active: boolean
    passwordChangedAt: Date
    passwordResetToken: string
    passwordResetExpired: Date
    updatedAt: Date
    createdAt: Date
}


const accountSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Account name is required'],
        unique: true
    },
    telephone: Number,
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: {
        type: Date,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpired: {
        type: Date,
        select: false
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

export const Account = mongoose.model<AccountInterface>('Account', accountSchema)