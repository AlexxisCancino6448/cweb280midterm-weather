const weatherService = require('../services/weatherstack.service');

exports.fetchCurrentWeather = async (req, res, next) => {
  try {
    const result = await weatherService.fetchAndSaveSnapshot({ query: req.query.query, units: req.query.units || 'm', requestedBy: req.user?.id || null });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.listSnapshots = async (req, res, next) => {
  try {
    const snapshots = await weatherService.listSnapshots(req.query.query);
    res.json({ success: true, data: snapshots });
  } catch (err) {
    next(err);
  }
};
