const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');

// exports.signup = async (req, res) => {
//   try {
//     const hash = bcrypt.hash(req.body.password, 10);
//     const user = await new User({
//       email: req.body.email,
//       password: hash
//     });
//     if (!user) {
//       throw new Error(
//         `Veuillez remplir les champs email et mot de passe ${res.status(400)}`
//       );
//     } else {
//       user.save();
//       res.status(201).json({ message: 'Utilisateur créé !' });
//     }
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// };

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
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