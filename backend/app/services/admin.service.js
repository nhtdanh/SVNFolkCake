const Cake = require("../models/Cake");
const User = require("../models/User");
const Review = require("../models/Review");

async function dashboardStats() {
  const [cakeCount, userCount, reviewCount] = await Promise.all([
    Cake.countDocuments(),
    User.countDocuments(),
    Review.countDocuments(),
  ]);
  return { cakeCount, userCount, reviewCount };
}

module.exports = { dashboardStats };
