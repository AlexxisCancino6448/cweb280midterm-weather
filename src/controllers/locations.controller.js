const locationService = require('../services/location.service');

exports.listSavedLocations = async (req, res, next) => {
  try {
    const list = await locationService.listByUser(req.user.id);
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

exports.createSavedLocation = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const created = await locationService.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
};

exports.getSavedLocation = async (req, res, next) => {
  try {
    const item = await locationService.getById(req.params.id, req.user.id);
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateSavedLocation = async (req, res, next) => {
  try {
    const updated = await locationService.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteSavedLocation = async (req, res, next) => {
  try {
    await locationService.remove(req.params.id, req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
