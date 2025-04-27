import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  name: string;
  type: string;
  image: string;
  description: string;
  location: string;
  fullAddress?: string;
  latitude?: string;
  longitude?: string;
  contact?: string;
  phone?: string;
  featured: boolean;
  created_at: Date;
  updated_at: Date;
}

const ActivitySchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  fullAddress: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  contact: { type: String },
  phone: { type: String },
  featured: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update the updated_at field on save
ActivitySchema.pre<IActivity>('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Check if model exists before creating a new one (for hot reloading)
export default mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);
