const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = async (req, res) => {
  const productObject = JSON.parse(req.body.sauce);
  console.log(productObject);
  try {
    const addSauce = new Sauce({
      ...productObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    const result = await addSauce.save();
    if (result) {
      res.status(201).json({ message: 'Sauce ajouté' });
    }
  }
  catch (error) {
    res.status(400).json({ error });
  }
};

exports.quoteSauce = async (req, res) => {
  try {
    // Je cherche l'ID de la sauce sélectionnée
    const sauceId = await Sauce.findOne({ _id: req.params.id });

    // J'évalue le like du corp de la requête avec "switch"
    switch (req.body.like) {
      // Dans le cas 0, je gère le retrait des votes "likes" et "dislikes"
      case 0:
        // Je cherche si l'utilisateur est déjà dans "usersLiked"
        if (sauceId.usersLiked.find((user) => user === req.body.userId)) {
          await Sauce.updateOne(
            {
              _id: req.params.id
            },
            {
              /**
               * Si oui, je met à jour la sauce avec le _id présent dans la requête
               * Je retire la valeur des likes de 1
              */
              $inc: { likes: -1 },
              // Je retire l'utilisateur de "usersLiked"
              $pull: { usersLiked: req.body.userId },
            }
          );
          res.status(201).json({ message: "vote retiré." });
        }
        if (sauceId.usersDisliked.find((user) => user === req.body.userId)) {
          // Mêmes principes que précédemment dans "usersDisliked"
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
            }
          );
          res.status(201).json({ message: "vote retiré." });
        }
        break;

      // Dans le cas 1, je gère le vote des "likes"
      case 1:
        // Je cherche la sauce avec le _id présent dans la requête
        await Sauce.updateOne(
          {
            _id: req.params.id
          },
          {
            // (Incrémentation) J'ajoute la valeur de "likes" par 1
            $inc: { likes: 1 },
            // J'ajoute l'utilisateur dans "usersLiked"
            $push: { usersLiked: req.body.userId },
          }
        );
        res.status(201).json({ message: "vote enregistré." });
        break;

      //  Dans le cas -1, je gère le vote des "dislikes"
      case -1:
        await Sauce.updateOne(
          // Je cherche la sauce avec le _id présent dans la requête
          {
            _id: req.params.id
          },
          {
            // (Incrémentation) J'ajoute la valeur de "dislikes" par 1
            $inc: { dislikes: 1 },
            // J'ajoute l'utilisateur dans "usersDisliked".
            $push: { usersDisliked: req.body.userId },
          }
        );
        res.status(201).json({ message: "vote enregistré." });
        break;
      // J'ajoute une sortie par défaut s'il n'y a aucune correspondance aux cas
      default:
        res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifySauce = async (req, res) => {
  const productObject = req.file ? {
    ...JSON.parse(req.body.product),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  try {
    const sauceId = await Sauce.findOne({ _id: req.params.id });
    if (sauceId.userId != req.auth.userId) {
      res.status(403).json({ error: "Invalid user ID" });
    }
    const result = await Sauce.updateOne({
      _id: req.params.id
    },
      {
        ...productObject, _id: req.params.id
      });
    if (result) {
      res.status(200).json({ message: 'Sauce modifié' });
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};

exports.deleteSauce = async (req, res) => {
  try {
    const result = await Sauce.findOne({ _id: req.params.id });
    if (result.userId != req.auth.userId) {
      res.status(403).json({ error: "Invalid user ID" });
    } else {
      const fileName = result.imageUrl.split('/images/')[1];
      fs.unlink(`images/${fileName}`, () => {
        result.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Sauce supprimé' });
        if (!fileName) {
          return res.status(401).json({ error });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  };
};

exports.getOneSauce = async (req, res) => {
  const result = await Sauce.findOne({
    _id: req.params.id
  });
  try {
    if (result) {
      return res.status(200).json(result);
    }
  }
  catch (error) {
    res.status(400).json({ error });
  };
};

exports.getAllSauce = async (req, res) => {
  const result = await Sauce.find();
  try {
    if (result) {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};