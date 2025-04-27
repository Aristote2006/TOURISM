import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivity extends Document {
  user_id: mongoose.Types.ObjectId;
  last_active: Date;
}

const UserActivitySchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  last_active: { type: Date, default: Date.now }
});

// Check if model exists before creating a new one (for hot reloading)
export default mongoose.models.UserActivity || mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);
