const mongoose = require("mongoose");

const mediaFolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "media_folder",
      default: null,
    },
    level: { type: Number, enum: [1, 2], required: true },
    path: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("media_folder", mediaFolderSchema);
