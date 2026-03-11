import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  travelDate: { type: Date, required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' },
  paymentId: { type: String },
  qrCodeData: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
