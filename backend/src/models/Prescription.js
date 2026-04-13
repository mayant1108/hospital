import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
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
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    medicines: [
        {
            name: {
                type: String,
                required: true,
                trim: true
            },
            dosage: {
                type: String,
                required: true,
                trim: true
            },
            duration: {
                type: String,
                required: true,
                trim: true
            },
            frequency: String
        }
    ],
    notes: {
        type: String,
        trim: true
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

prescriptionSchema.index({ patient: 1, date: -1 });
prescriptionSchema.index({ doctor: 1, date: -1 });

export default mongoose.model('Prescription', prescriptionSchema);
