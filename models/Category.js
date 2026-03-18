import mongoose, { Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
    },
    imageUrl: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true ,strict: false},
);

const Category = mongoose.model('categories', categorySchema);

export default Category;
