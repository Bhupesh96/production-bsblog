const mongoose = require("mongoose");

// Schema
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a post title"], // ✅ Fixed "require" → "required"
    },
    description: {
      type: String,
      required: [true, "Please add a post description"], // ✅ Fixed "require" → "required"
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true, // ✅ Fixed "require" → "required"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
