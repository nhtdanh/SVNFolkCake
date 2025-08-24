const reviewService = require("../services/review.service");
const ApiError = require("../api-error");

async function create(req, res, next) {
  try {
    // console.log(req.body)
    const { cakeId, rating, comment } = req.body;
    if (!cakeId || !rating) {
      return next(new ApiError(400, "cakeId and rating are required"));
    }
    if (rating < 1 || rating > 5) {
      return next(new ApiError(400, "Rating must be between 1 and 5"));
    }

    const review = await reviewService.create(
      req.user.id,
      cakeId,
      rating,
      comment
    );
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ApiError(409, "You have already reviewed this cake"));
    }
    next(new ApiError(400, err.message));
  }
}

async function update(req, res, next) {
  try {
    const { rating, comment } = req.body;
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return next(new ApiError(400, "Rating must be between 1 and 5"));
    }

    const review = await reviewService.update(req.params.id, rating, comment);
    res.json(review);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function remove(req, res, next) {
  try {
    await reviewService.remove(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function listByCake(req, res, next) {
  try {
    const reviews = await reviewService.listByCake(req.params.cakeId);
    res.json(reviews);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function listByUser(req, res, next) {
  try {
    const reviews = await reviewService.listByUser(req.user.id);
    res.json(reviews);
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

module.exports = {
  create,
  update,
  remove,
  listByCake,
  listByUser,
};
