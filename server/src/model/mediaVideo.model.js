const mongoose = require("mongoose");

const mediaVideoSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    path: { type: String, required: true, trim: true },
    root_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media_folder",
      required: true,
    },
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media_folder",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("media_video", mediaVideoSchema);
