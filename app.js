const express = require('express');
const mongoose = require('mongoose');
const sauceRoute = require('./routes/sauce');
const userRoute = require('./routes/user');
const path = require('path');
const app = express();
require('dotenv').config();

mongoose.set('strictQuery', true),
  mongoose.connect(process.env.mongoDB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connexion établie à MongoDB'))
    .catch(() => console.log('Erreur de connexion à MongoDB'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
