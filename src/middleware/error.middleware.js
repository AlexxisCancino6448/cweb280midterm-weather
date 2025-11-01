module.exports = (err, req, res, next) => {
  // basic error logging for debugging
  console.error(err);

  const status = err.status || 500;
  const payload = { error: err.message || 'internal Server Error' };

  // if the validation details were attached they're inlcuded
  if (err.details) payload.details = err.details;

  res.status(status).json(payload);
};
