import mongoose, { Schema, Document } from 'mongoose';


interface IPassport extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    lastName: string;
    birthDate: string;
    nationality: string;
    passportNumber: string;
    expirationDate: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const passportSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es requerida']
    },
    nationality: {
        type: String,
        required: [true, 'La nacionalidad es requerida'],
        trim: true
    },
    passportNumber: {
        type: String,
        required: [true, 'El número de pasaporte es requerido'],
        unique: true,
        trim: true
    },
    expirationDate: {
        type: Date,
        required: [true, 'La fecha de expiración es requerida']
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

export default mongoose.model<IPassport>('Passport', passportSchema);