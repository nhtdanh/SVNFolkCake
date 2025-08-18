const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title:{type: String}, //Cần nếu mở rộng nhiều recipe cho 1 cake
    cake: { type: mongoose.Schema.Types.ObjectId, ref: "Cake", required: true },

    ingredients: [
      {
        name: { type: String, required: true },
        quantity: { type: Number },
        unit: { type: String },
      },
    ],

    instructions: { type: [String] },

    nutritionCalories: Number,
    nutritionProtein: Number,
    nutritionCarbs: Number,
    nutritionFat: Number,
    serves: Number, //số phần ăn 
    cookingTime: Number, // minutes
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },

    video:{title: String, link: String,},
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;
