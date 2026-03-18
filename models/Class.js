import mongoose, { Schema } from 'mongoose';

const classSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    audioProfile: { type: String ,default: null},
    audioFile: { type: String, default: null },
    durationSeconds: { type: Number },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'authors',
    //   required: true,
    },
    code: { type: String, default: null },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
    //   required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null,
    },
    seriesId:{
      type:String,
      default:null,
    },
    classType:{
      type: String,
      enum: ['free', 'paid'],
      default: 'paid',
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true ,strict: false},
);

const Classes = mongoose.model('classes', classSchema);

export default Classes;
