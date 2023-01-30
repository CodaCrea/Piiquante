const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.createSauce = async (req, res) => {
  // Récupération de la création en objet.
  const productObject = JSON.parse(req.body.sauce);
  try {
    // Je créé un nouvel objet en récupérant toutes ces informations, l'Id utilisateur et l'image.
    const addSauce = new Sauce({
      ...productObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    const result = await addSauce.save();
    // S'il y a un résultat je signal un succès, la publication est enregistrée.
    if (result) {
      res.status(201).json({ message: 'Sauce added' });
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
          res.status(201).json({ message: "Vote withdrawn" });
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
          res.status(201).json({ message: "Vote withdrawn" });
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
        res.status(201).json({ message: "Recorded vote" });
        break;

      //  Dans le cas -1, je gère le vote des "dislikes"
      case -1:
        await Sauce.updateOne(
          // Je recherche la sauce avec le _id présent dans la requête
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
        res.status(201).json({ message: "Recorded vote" });
        break;
      // J'ajoute une sortie par défaut s'il n'y a aucune correspondance aux cas
      default:
        res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifySauce = async (req, res) => {
  const productObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  try {
    // Je recherche l'Id de la sauce en utilisant le paramètre de l'URL.
    const sauceId = await Sauce.findOne({ _id: req.params.id });
    // Je vérifie si l'utilisateur est différent à l'utilisateur qui a publié la sauce.
    if (sauceId.userId != req.auth.userId) {
      // Si c'est le cas je signal une erreur.
      res.status(403).json({ error: "Invalid user ID" });
    }
    // Je met à jour la sauce qui doit être mise à jour en utilisant le paramètre de l'URL.
    const result = await Sauce.updateOne({
      _id: req.params.id
    },
      {
        ...productObject, _id: req.params.id
      });
    // S'il y a un résultat je signal un succès.
    if (result) {
      res.status(200).json({ message: "modified sauce" });
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};

exports.deleteSauce = async (req, res) => {
  try {
    // Je recherche l'Id de la sauce en utilisant le paramètre de l'URL.
    const result = await Sauce.findOne({ _id: req.params.id });
    // Je vérifie si l'utilisateur est différent à l'utilisateur qui a publié la sauce.
    if (result.userId != req.auth.userId) {
      // Si c'est le cas je signal une erreur.
      res.status(403).json({ error: "Invalid user ID" });
    } else {
      // Sinon je supprime l'image du dossier "images", puis la publication.
      const fileName = result.imageUrl.split('/images/')[1];
      fs.unlink(`images/${fileName}`, () => {
        result.deleteOne({ _id: req.params.id });
        // Je signal un succès.
        res.status(200).json({ message: "Sauce removed" });
        // Si aucune image est a supprimer je signal une erreur.
        if (!fileName) {
          res.status(401).json({ error });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  };
};

exports.getOneSauce = async (req, res) => {
  // Je recherche l'Id de la sauce en utilisant le paramètre de l'URL.
  const result = await Sauce.findOne({
    _id: req.params.id
  });
  try {
    // S'il y a un résultat je signal un succès.
    if (result) {
      res.status(200).json(result);
    }
  }
  catch (error) {
    res.status(400).json({ error });
  };
};

exports.getAllSauce = async (req, res) => {
  // Je recherche toutes les sauces.
  const result = await Sauce.find();
  try {
    // S'il y a un résultat je signal un succès.
    if (result) {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};