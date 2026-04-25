import mongoose, { Schema } from 'mongoose';
import { IMember } from './user.types';

const MemberSchema = new Schema<IMember>(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:          { type: String, required: true, trim: true },
    membershipId:   { type: String, unique: true },
    membershipType: { type: String, enum: ['basic', 'premium'], default: 'basic' },
    status:         { type: String, enum: ['active', 'suspended', 'expired'], default: 'active' },
    joinedAt:       { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate membershipId
MemberSchema.pre('save', function (next) {
  if (this.isNew && !this.membershipId) {
    this.membershipId = `LMS-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

export const MemberModel = mongoose.model<IMember>('Member', MemberSchema);
