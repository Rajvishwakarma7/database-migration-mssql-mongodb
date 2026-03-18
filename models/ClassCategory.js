import mongoose, { Schema } from 'mongoose';

const classCategorySchema = new Schema(
  {
    classId: {
      type: Schema.Types.ObjectId,
      ref: 'classes',
      required: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: true,
      index: true,
    },

  },
  { timestamps: true,strict: false },
);



const ClassCategory = mongoose.model('classCategories', classCategorySchema);

export default ClassCategory;