// business logic for registration and login uses bcrypt for hashing and JWT for tokens
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/user.model');
const { knex } = require('../db');

const SALT_ROUNDS = 10;

// registers a user, enforces unique email at application level and relies on DB UNIQUE for safety
async function registerUser({ username, email, password }) {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const created = await userModel.create({ username, email, passwordHash });
  const token = signToken(created);
  return { user: created, token };
}

// logs in user. reads raw DB row if necessary to access stored password_hash
async function loginUser({ email, password }) {
  const raw = await knex('users').where({ email }).first();
  if (!raw || !raw.password_hash) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const ok = await bcrypt.compare(password, raw.password_hash);
  if (!ok) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  return signToken({ id: raw.id, email: raw.email });
}

function signToken(user) {
  const payload = { sub: user.id, email: user.email };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

module.exports = { registerUser, loginUser };
