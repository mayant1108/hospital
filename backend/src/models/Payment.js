import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Card', 'Cash', 'Wallet'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: true,      
    versionKey: false
});


paymentSchema.index({ patient: 1, date: -1 });
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);
