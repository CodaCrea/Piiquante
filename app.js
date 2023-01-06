const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res) => {
  res.json({ message: 'Connexion établie' });
});

module.exports = app;