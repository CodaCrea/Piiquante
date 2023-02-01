const myEmail = require('validator');

module.exports = (req, res, next) => {
  if (!myEmail.isEmail(req.body.email)) {
    const error = { error: "Invalid email" };
    res.status(401).json(error);
  } else {
    next();
  }
};