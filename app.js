const express = require('express');
const mongoose = require('mongoose');
const sauceRoute = require('./routes/sauce');
const userRoute = require('./routes/user');
const path = require('path');
const app = express();
require('dotenv').config();

// Avec "strictQuery" en "true" par défaut, Mongoose filtrera les propriétés de filtre de requête qui ne figurent pas dans le schéma.
mongoose.set('strictQuery', true),
  mongoose.connect(process.env.mongoDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connexion établie à MongoDB'))
    .catch(() => console.log('Erreur de connexion à MongoDB'));

// "express.json" analyse les requêtes "JSON" entrantes et place les données analysées dans le corp de la requête.
app.use(express.json());

// Réponse des en-têtes.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Les routes des sauces, de l'authentification et la sauvegarde d'images dans le dossier "images".
app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;