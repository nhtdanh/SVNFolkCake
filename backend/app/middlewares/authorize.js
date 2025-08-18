const ApiError = require('../api-error');

module.exports = function authorize(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized'));
    }
    if (req.user.role !== requiredRole) {
      return next(new ApiError(403, 'Forbidden'));
    }
    next();
  };
};