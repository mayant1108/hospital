import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    departments: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true,
    versionKey: false
});

clinicSchema.index({ name: 1 });
clinicSchema.index({ email: 1 });
clinicSchema.index({ departments: 1 });

clinicSchema.virtual('departmentCount').get(function() {
    return this.departments ? this.departments.length : 0;
});

clinicSchema.set('toJSON', { virtuals: true });
clinicSchema.set('toObject', { virtuals: true });

export default mongoose.model('Clinic', clinicSchema);
