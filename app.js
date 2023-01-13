const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
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

app.use('/api/auth', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/auth', userRoute);

module.exports = app;
