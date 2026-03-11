import mongoose from 'mongoose';

const busRouteSchema = new mongoose.Schema({
  bus_number: { type: String, required: true },
  bus_type: { type: String, required: true },
  source: { type: String, required: true, index: true },
  destination: { type: String, required: true, index: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  ticket_price_rs: { type: Number, required: true },
  available_seats: { type: Number, required: true },
});

export const BusRoute = mongoose.models.BusRoute || mongoose.model('BusRoute', busRouteSchema);
