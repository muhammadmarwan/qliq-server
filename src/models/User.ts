import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  referrer?: Types.ObjectId;
  referralCode: string; // NEW FIELD
  level: number;
  downlines: Types.ObjectId[];
  commissionBalance: number; 
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true }, // NEW
  referrer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  level: { type: Number, default: 0 },
  downlines: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  commissionBalance: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
