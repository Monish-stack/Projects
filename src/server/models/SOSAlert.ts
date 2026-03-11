import mongoose, { Schema, Document } from 'mongoose';

export interface ISOSAlert extends Document {
  user_id: string;
  bus_number: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  status: 'Pending' | 'Resolved';
}

const SOSAlertSchema: Schema = new Schema({
  user_id: { type: String, required: true },
  bus_number: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' }
});

export const SOSAlert = mongoose.model<ISOSAlert>('SOSAlert', SOSAlertSchema);
