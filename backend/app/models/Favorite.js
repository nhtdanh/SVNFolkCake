const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

//1 user không thể favorite 1 cake nhiều lần
favoriteSchema.index({ user: 1, cake: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
