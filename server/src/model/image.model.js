const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: String,
    path: String,
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "folder",
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("image", imageSchema);
