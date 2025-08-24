const mongoose = require("mongoose");
const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cakes: [
      {
        cake: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cake",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi cặp user-cake không trùng lặp trong mảng
favoriteSchema.index(
  { user: 1, "cakes.cake": 1 },
  { unique: true, sparse: true }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
