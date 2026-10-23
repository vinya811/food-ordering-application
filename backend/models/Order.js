const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    items: {
      type: Array,
      required: true
    },

    deliveryDetails: {
      type: Object,
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      default: "Order Placed"
    },

    orderDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);