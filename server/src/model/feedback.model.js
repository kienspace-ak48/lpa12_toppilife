const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    customer_name: { type: String, default: "" },
    star: { type: Number, default: 5, min: 1, max: 5 },
    comment: { type: String, default: "" },
    avatar_url: { type: String, default: "" },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => !arr || arr.length <= 2,
        message: "Max 2 images",
      },
    },
    video_url: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("feedback", feedbackSchema);
