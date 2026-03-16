import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
      required: true,
    },
    otp: { type: String, default: null },
    otpExpiryTime: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zip: { type: String, trim: true },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    referredBy:{ type: String },
    notes:{ type: String },
  },
  { timestamps: true ,  strict: false },
);


const Users = mongoose.model('users', userSchema);

export default Users;
