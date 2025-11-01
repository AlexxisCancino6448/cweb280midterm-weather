// controllers remain thin so they validate the request, call the service, and then respond. the errors are forwarded to the error handler
const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.registerUser({ username, email, password });
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await authService.loginUser({ email, password });
    res.json({ success: true, data: { token } });
  } catch (err) {
    next(err);
  }
};
