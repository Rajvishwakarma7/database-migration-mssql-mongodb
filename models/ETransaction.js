import mongoose, { Schema } from "mongoose";

const eTransactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    transactionId: {
      type: String,
      required: true,
      // Tran_token from ePN response
    },
    paymentToken: {
      type: String,
      trim: true,
      default: null,
      // eslint-disable-next-line spellcheck/spell-checker
      // XactID from ePN response,
    },
    amount: {
      type: Number,
      default: 0,
    },
    holdBalance: {
      type: Number,
    },
    type: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      trim: true,
      enum: ["pending", "success", "failed", "cancelled", "refunded"],
    },
    transactionDate: {
      type: Date,
    },
    invoice: {
      type: String,
      trim: true,
      default: null,
    },
    sqlUserId: {
      type: String,
      trim: true,
    },
    comment: {
    type: String,
      trim: true,
    },
     response: {
      type: String,
      trim: true,
    },
     shoppingStateID: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

const ETransaction = mongoose.model("etransactions", eTransactionSchema);

export default ETransaction;
