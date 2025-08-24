const Review = require("../models/Review");
const Cake = require("../models/Cake");
const mongoose = require("mongoose");

async function recalcRating(cakeId) {
  // đảm bảo cakeId là ObjectId
  const objId = new mongoose.Types.ObjectId(cakeId);

  const res = await Review.aggregate([
    { $match: { cake: objId } },
    {
      $group: {
        _id: "$cake",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (res.length > 0) {
    const { average, count } = res[0];
    // round to 2 decimals
    const avgRounded = Number(Number(average).toFixed(2));
    await Cake.findByIdAndUpdate(
      cakeId,
      { "rating.average": avgRounded, "rating.count": count },
      { new: true }
    );
  } else {
    await Cake.findByIdAndUpdate(
      cakeId,
      { "rating.average": 0, "rating.count": 0 },
      { new: true }
    );
  }
}

async function create(userId, cakeId, rating, comment) {
  const review = new Review({ user: userId, cake: cakeId, rating, comment });
  await review.save();
  await recalcRating(cakeId);
  return review;
}

async function update(reviewId, rating, comment) {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  await review.save();
  await recalcRating(review.cake);
  return review;
}

async function remove(reviewId) {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  const cakeId = review.cake;
  await review.remove();
  await recalcRating(cakeId);
}

async function listByCake(cakeId) {
  return Review.find({ cake: cakeId }).populate("user", "username");
}

async function listByUser(userId) {
  return Review.find({ user: userId }).populate("cake", "name");
}

module.exports = {
  create,
  update,
  remove,
  listByCake,
  listByUser,
};
