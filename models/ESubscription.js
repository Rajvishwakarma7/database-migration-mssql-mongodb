import mongoose, { Schema } from "mongoose";

const esubscriptionSchema = new Schema(
  {
    userId: {
      type: String, // matches UserId from SQL & users collection
      required: true,
      index: true,
    },

    subscribePlanID: {
      type: Number,
      required: true,
    },

    startSubscribeDate: Date,
    endSubscribeDate: Date,
    activationDate: Date,

    cancelSubscribe: {
      type: Boolean,
      default: false,
    },

    declineSubscribe: {
      type: Boolean,
      default: false,
    },

    activationFailCnt: {
      type: Number,
      default: 0,
    },
    mUserId:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    // optional computed field (VERY useful 🚀)
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ESubscription = mongoose.model("esubscriptions", esubscriptionSchema);

export default ESubscription;