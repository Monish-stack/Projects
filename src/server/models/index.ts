import mongoose from 'mongoose';

const { Schema } = mongoose;

const DistrictSchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  region: { type: String }
});

const VillageSchema = new Schema({
  name: { type: String, required: true },
  district_id: { type: Schema.Types.ObjectId, ref: 'District' },
  pincode: { type: String },
  population: { type: Number }
});

const BusStandSchema = new Schema({
  name: { type: String, required: true },
  district_id: { type: Schema.Types.ObjectId, ref: 'District' },
  village_id: { type: Schema.Types.ObjectId, ref: 'Village' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  capacity: { type: Number }
});

const BusRouteSchema = new Schema({
  bus_number: { type: String, required: true },
  bus_type: { type: String, required: true },
  source: { type: String, required: true, index: true },
  destination: { type: String, required: true, index: true },
  departure_time: { type: String, required: true },
  arrival_time: { type: String, required: true },
  ticket_price_rs: { type: Number, required: true },
  available_seats: { type: Number, required: true },
});

const BusStopSchema = new Schema({
  route_id: { type: Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  sequence: { type: Number, required: true }
});

const BusTimingSchema = new Schema({
  route_id: { type: Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  departure_time: { type: String, required: true }, // HH:mm format
  arrival_time: { type: String, required: true },
  days_of_operation: [{ type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }]
});

const BusOperatorSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Government', 'Private'] },
  contact_info: { type: String }
});

const BusLocationSchema = new Schema({
  bus_id: { type: String, required: true },
  route_id: { type: Schema.Types.ObjectId, ref: 'BusRoute' },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  speed: { type: Number },
  heading: { type: Number },
  timestamp: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  favorite_routes: [{ type: Schema.Types.ObjectId, ref: 'BusRoute' }],
  createdAt: { type: Date, default: Date.now }
});

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  busRouteId: { type: Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  bus_number: { type: String },
  source: { type: String },
  destination: { type: String },
  distance_km: { type: Number },
  travelDate: { type: Date, required: true },
  seats: [{ type: String, required: true }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled', 'Pending'], default: 'Confirmed' },
  paymentId: { type: String },
  qrCodeData: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  busRouteId: { type: Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const DriverSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  license_number: { type: String, required: true },
  assigned_bus: { type: String },
  current_route: { type: Schema.Types.ObjectId, ref: 'BusRoute' }
});

const AnnouncementSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  target_segment: { type: String, enum: ['All', 'Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem'], default: 'All' },
  created_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

const FeedbackSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, enum: ['Timing Inaccuracy', 'Route Discrepancy', 'Driver Conduct', 'App Issue', 'Other'], required: true },
  description: { type: String, required: true },
  busNumber: { type: String },
  route: { type: String },
  route_id: { type: Schema.Types.ObjectId, ref: 'BusRoute' },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Resolved'], default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

export const District = mongoose.models.District || mongoose.model('District', DistrictSchema);
export const Village = mongoose.models.Village || mongoose.model('Village', VillageSchema);
export const BusStand = mongoose.models.BusStand || mongoose.model('BusStand', BusStandSchema);
export const BusRoute = mongoose.models.BusRoute || mongoose.model('BusRoute', BusRouteSchema);
export const BusStop = mongoose.models.BusStop || mongoose.model('BusStop', BusStopSchema);
export const BusTiming = mongoose.models.BusTiming || mongoose.model('BusTiming', BusTimingSchema);
export const BusOperator = mongoose.models.BusOperator || mongoose.model('BusOperator', BusOperatorSchema);
export const BusLocation = mongoose.models.BusLocation || mongoose.model('BusLocation', BusLocationSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Driver = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
export const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const SOSAlert = mongoose.models.SOSAlert || mongoose.model('SOSAlert', new Schema({
  user_id: { type: String, required: true },
  bus_number: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
}));

export const Seat = mongoose.models.Seat || mongoose.model('Seat', new Schema({
  bus_route_id: { type: Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  seat_number: { type: String, required: true },
  is_window: { type: Boolean, default: false },
  is_booked: { type: Boolean, default: false },
  proximity_score: { type: Number, default: 0 },
  travel_date: { type: Date, required: true }
}));
