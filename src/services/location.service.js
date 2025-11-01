// enforces ownership and orchestrates saved location operations
const savedLocationModel = require('../models/savedLocation.model');

async function create({ userId, name, query, notes }) {
  return savedLocationModel.create({ userId, name, query, notes });
}

async function listByUser(userId) {
  return savedLocationModel.listByUser(userId);
}

async function getById(id, requestingUserId) {
  const item = await savedLocationModel.getById(id);
  if (!item) return null;
  if (item.userId !== requestingUserId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return item;
}

async function update(id, requestingUserId, updates) {
  const item = await savedLocationModel.getById(id);
  if (!item) {
    const err = new Error('Not Found');
    err.status = 404;
    throw err;
  }
  if (item.userId !== requestingUserId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return savedLocationModel.update(id, updates);
}

async function remove(id, requestingUserId) {
  const item = await savedLocationModel.getById(id);
  if (!item) {
    const err = new Error('Not Found');
    err.status = 404;
    throw err;
  }
  if (item.userId !== requestingUserId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
  return savedLocationModel.remove(id);
}

module.exports = { create, listByUser, getById, update, remove };
