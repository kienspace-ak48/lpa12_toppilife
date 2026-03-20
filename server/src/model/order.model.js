const mongoose = require("mongoose");

const orderSchame = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchame);
