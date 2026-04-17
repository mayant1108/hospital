import mongoose from 'mongoose';

const appointmentRequestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
    },
    preferredDate: {
      type: Date,
    },
    preferredTime: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    source: {
      type: String,
      default: 'website',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

appointmentRequestSchema.index({ status: 1, createdAt: -1 });
appointmentRequestSchema.index({ department: 1 });

export default mongoose.model('AppointmentRequest', appointmentRequestSchema);
