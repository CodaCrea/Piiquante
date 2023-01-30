const schema = require('../models/Password');

module.exports = (req, res, next) => {
  const error = { error: "Invalid password" };
  if (!schema.validate(req.body.password)) {
    req.badPassword = 1;
    res.status(401).json(error);
  }
  next();
};