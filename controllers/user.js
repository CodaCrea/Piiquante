const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
  try {
    // Je créé l'utilisateur en récupérant l'email inscrit dans le corp de la requête et son mot de passe que je hache avec "bcrypt" en 10 passages.
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    const result = await user.save();
    // S'il y a un résultat je signal un succès, l'utilisateur est enregistré.
    if (result) {
      res.status(201).json({ message: "Utilisateur créé" });
      // Sinon je signal une erreur.
    } else {
      res.status(401).json({ error: "Erreur de la création d'utilisateur" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  try {
    // Je recherche l'email inscrit dans le corp de la requête.
    const user = await User.findOne({ email: req.body.email });
    // Je vérifie si elle existe. Si ce n'est pas la cas je signal une erreur.
    if (!user) {
      res.status(401).json({ error: "Utilisateur non trouvé" });
    }
    // Je compare le mot de passe inscrit dans le corp de la requête avec celui de l'email enregistré.
    const valid = await bcrypt.compare(req.body.password, user.password);
    // Je vérifie s'il est valide. Si ce n'est pas le cas je signal une erreur.
    if (!valid) {
      res.status(401).json({ error: "Mot de passe invalide" });
      // Sinon je signal un succès et autorise l'utilisateur à se connecter pour une période de 24h.
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