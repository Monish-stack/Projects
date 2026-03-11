import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
  bus_number: { type: String, required: true, unique: true },
  route_id: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  speed: { type: Number, default: 0 },
  next_stop: { type: String },
  status: { type: String, enum: ['Running', 'Stopped', 'Delayed'], default: 'Running' },
  route_path: [{
    lat: Number,
    lng: Number,
    name: String
  }],
  last_updated: { type: Date, default: Date.now }
});

export const BusLocation = mongoose.model('BusLocation', busLocationSchema);
