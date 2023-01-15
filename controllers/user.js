const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    const ret = await user.save();
    console.log(ret);
    if (ret) {
      res.status(201).json({ message: "Utilisateur créé" });
    } else {
      const error = {
        message: "failed to creating user",
      };
      res.status(401).json(error);
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const valid = await bcrypt.compare(res.body.password, user.password);
    if (!user || !valid) {
      throw new Error(`email ou mot de passe incorrect ${res.status(401)}`);
    } else {
      res.status(200).json({
        userId: user._id,
        token: jsonWebToken.sign(
          { userId: user._id },
          process.env.TOKEN_KEY,
          { expiresIn: '24h' }
        )
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};