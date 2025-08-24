const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config();

async function register(data) {
  const username = data.username.trim();
  const email = data.email.trim().toLowerCase();
  const password = data.password;

  const exists = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (exists) throw new Error("Registration failed");

  const hash = await bcrypt.hash(password, 10); //10 salts round, hoac 12

  const user = new User({ ...data, username, email, password: hash });
  await user.save();
  const { password: _, ...safeUser } = user.toObject();
  return safeUser;
}

async function login(username, password) {
  username = username.trim();

  const user = await User.findOne({ username });
  if (!user) throw new Error("Invalid username or password");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Invalid username or password");

  const payload = { id: user._id, role: user.role, username: user.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const { password: _, ...safeUser } = user.toObject();
  return { user: safeUser, token };
}

module.exports = { register, login };
