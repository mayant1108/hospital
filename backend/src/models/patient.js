import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    age: {
        type: Number,
        min: 0,
        max: 120,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    medicalHistory: [{
        condition: String,
        diagnosedDate: Date,
        notes: String
    }]
}, {
    timestamps: true,
    versionKey: false
});

patientSchema.index({ user: 1 });

export default mongoose.model('Patient', patientSchema);
