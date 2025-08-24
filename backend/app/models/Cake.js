const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    englishName: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    description: String,
    rating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 },
    },

    image: {
      main: { type: String, default: "/public/uploads/cakes/default.jpg" },
      gallery: { type: [String], default: [] },
    },
    tags: [String],
    origin: String,
  },
  { timestamps: true }
);

const Cake = mongoose.model("Cake", cakeSchema);
module.exports = Cake;
