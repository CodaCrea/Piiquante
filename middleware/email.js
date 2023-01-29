const myEmail = require('validator');

module.exports = (req, res, next) => {
  const error = { error: "Email invalide" };
  if (!myEmail.isEmail(req.body.email)) {
    req.invalidEmail = 1;
    res.status(401).json(error);
  }
  next();
};