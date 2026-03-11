import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
