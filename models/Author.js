import mongoose, { Schema } from 'mongoose';

const authorSchema = new Schema(
  {
    fullName: { type: String, required: true },
    bio: { type: String },
    profilePicture: { type: String },
    contactInfo: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Author = mongoose.model('authors', authorSchema);

export default Author;
