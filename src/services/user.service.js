// thin orchestration layer that validates business rules beyond simple DB constraints 
const userModel = require('../models/user.model');

async function getById(id) {
  return userModel.findById(id);
}

async function getByEmail(email) {
  return userModel.findByEmail(email);
}

async function create(payload) {
  return userModel.create(payload);
}

async function update(id, updates) {
  if (updates.units && !['c', 'f', 's'].includes(updates.units)) {
    const err = new Error('Invalid units');
    err.status = 422;
    throw err;
  }
  return userModel.update(id, updates);
}

async function remove(id) {
  return userModel.remove(id);
}

module.exports = { getById, getByEmail, create, update, remove };
