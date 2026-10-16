import mongoose from 'mongoose';

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const AdminUser = mongoose.model('AdminUser', adminUserSchema);
