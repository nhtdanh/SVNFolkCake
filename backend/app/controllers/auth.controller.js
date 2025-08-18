const authService = require("../services/auth.service");
const ApiError = require("../api-error");

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res
      .status(201)
      .json({ code: 0, msg: "User registered", data: { id: user._id } });
  } catch (err) {
    next(new ApiError(400, err.message));
  }
}

async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(
      req.body.username,
      req.body.password
    );
    res.json({ user, token });
  } catch (err) {
    next(new ApiError(401, err.message));
  }
}

module.exports = { register, login };
