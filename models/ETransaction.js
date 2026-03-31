import mongoose, { Schema } from "mongoose";

const eTransactionSchema = new Schema(
  {
    userId: {
      type: String, // GUID from SQL
      index: true,
      required: true,
    },

    userRef: {
      type: Schema.Types.ObjectId,
      ref: "users",
      default: null,
      index: true,
    },

    transactionId: {
      type: Number, // shoppingTransactionID
      index: true,
    },

    amount: {
      type: Number,
      default: 0,
    },

    holdBalance: {
      type: Number,
      default: 0,
    },

    type: {
      type: String, // authorize / purchase
    },

    status: {
      type: String, // success / failed
    },

    gateway: {
      name: {
        type: String,
        default: "eProcessingNetwork",
      },
      transactionId: String, // tranID
      response: String,
    },

    paymentMeta: {
      ccLast4: String,
      ccExp: String,
    },

    cart: {
      membershipCartID: String,
      cartStateID: Number,
      cartTypeID: String,
      expirationDate: Date,
    },

    transactionDate: Date,
  },
  {
    timestamps: true,
  }
);

const ETransaction = mongoose.model("e_transactions", eTransactionSchema);

export default ETransaction;