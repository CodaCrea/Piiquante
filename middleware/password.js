const schema = require('../models/Password');

module.exports = (req, res, next) => {
  if (!schema.validate(req.body.password)) {
    const error = { error: "Invalid password" };
    res.status(401).json(error);
  } else {
    next();
  }
};