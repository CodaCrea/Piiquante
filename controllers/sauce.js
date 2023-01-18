const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = async (req, res) => {
  const productObject = JSON.parse(req.body.sauce);
  try {
    delete productObject._id;
    delete productObject._userId;
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
    const sauceId = await Sauce.findOne({
      _id: req.params.id
    });
    console.log(sauceId);

    if (req.auth.userId) {
      if (req.body.likes === 1) {
        if (sauceId.usersLiked.includes(req.auth.userId)) {
          throw new Error(
            `Cette sauce a déjà un like ${res.status(401)}`
          );
        }
        const sauceUpdateLike = await Sauce.updateOne({
          _id: req.params.id
        },
          {
            likes: req.body.likes++
          },
          {
            usersLiked: req.body.userId
          });
        if (sauceUpdateLike) {
          sauceId.usersLiked.save();
          sauceId.usersDisliked.splice();
          return res.status(200).json({ message: "Like ajouté" });
        }

      } else if (req.body.likes === -1) {
        if (sauceId.usersDisliked.includes(req.auth.userId)) {
          throw new Error(
            `Cette sauce a déjà un disLike ${res.status(401)}`
          );
        }
        const sauceUpdateDislike = await Sauce.updateOne({
          _id: req.params.id
        },
          {
            dislikes: req.body.likes++
          },
          {
            usersDisliked: req.body.userId
          });
        if (sauceUpdateDislike) {
          sauceId.usersDisliked.save();
          sauceId.usersLiked.splice();
          return res.status(200).json({ message: "Dislike ajouté" });
        }

      } else {
        if (sauceId.usersLiked.includes(req.auth.userId)) {
          const sauceDeleteLike = await Sauce.updateOne({
            _id: req.params.id
          },
            {
              likes: -1
            },
            {
              usersLiked: req.body.userId
            });
          if (sauceDeleteLike) {
            sauceId.usersLiked.splice();
            return res.status(200).json({ message: "Like Supprimé" });
          }
        } else if (sauceId.usersDisliked.includes(req.auth.userId)) {
          const sauceDeleteDislike = await Sauce.updateOne({
            _id: req.params.id
          },
            {
              dislikes: -1
            },
            {
              usersDisliked: req.body.userId
            });
          if (sauceDeleteDislike) {
            sauceId.usersDisliked.splice();
            return res.status(200).json({ message: "Dislike Supprimé" });
          }
        }
      }
    } else {
      throw new Error(
        `Vous n'êtes pas autorisé ${res.status(400)}`
      );
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
    delete productObject._userId;
    if (sauceId.userId != req.auth.userId) {
      throw new Error(
        `Vous n'êtes pas autorisé ${res.status(400)}`
      );
    }
    const result = await Sauce.updateOne({
      _id: req.params.id
    },
      {
        ...productObject, _id: req.params.id
      });
    if (result) {
      return res.status(200).json({ message: 'Sauce modifié' });
    }
  } catch (error) {
    res.status(400).json({ error });
  };
};

exports.deleteSauce = async (req, res) => {
  try {
    const result = await Sauce.findOne({ _id: req.params.id });
    if (result.userId != req.auth.userId) {
      throw new Error(
        `Vous n'êtes pas autorisé ${res.status(400)}`
      );
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