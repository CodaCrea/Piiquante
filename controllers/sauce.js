const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = async (req, res) => {
  const product = JSON.parse(req.body.string);
  try {
    delete product._id;
    delete product._userId;
    const sauce = new Sauce({
      ...product,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    const result = await sauce.save();
    if (result) {
      res.status(201).json({ message: 'Sauce ajouté' });
    }
  }
  catch (error) {
    res.status(400).json({ error });
  }
};

exports.likeQuote = async (req, res) => {
  try {
    Sauce.findOne({
      _id: req.params.id
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.modifySauce = async (req, res) => {
  const product = req.file ? {
    ...JSON.parse(req.body.string),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  try {
    const sauceId = await Sauce.findOne({ _id: req.params.id });
    delete product._userId;
    if (sauceId.userId != req.auth.userId) {
      throw new Error(
        `Vous n'êtes pas autorisé ${res.status(400)}`
      );
    }
    const result = await Sauce.updateOne({
      _id: req.params.id
    },
      {
        ...product, _id: req.params.id
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