import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        min: 0,
        required: true
    },
    fees: {
        type: Number,
        min: 0,
        required: true
    },
    availableDays: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    availableTime: {
        type: String,
        required: true
    },
    clinic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clinic'
    }
}, {
    timestamps: true,
    versionKey: false
});

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ clinic: 1 });

export default mongoose.model('Doctor', doctorSchema);
