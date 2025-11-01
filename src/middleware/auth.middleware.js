// JWT verification middleware attaches req.user = { id, email } on valid token
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'missing authorization token' });

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    // payload.sub is the user id as set by signToken
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid or expired token' });
  }
};
