import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true      
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    reason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,     
    versionKey: false
});

appointmentSchema.index({ doctor: 1, date: 1, time: 1 });
appointmentSchema.index({ patient: 1, date: 1 });

export default mongoose.model('Appointment', appointmentSchema);
