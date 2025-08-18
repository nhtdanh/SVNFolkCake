const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cake: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cake",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// Một user chỉ được review 1 lần cho 1 cake
reviewSchema.index({ user: 1, cake: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
