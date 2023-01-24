const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
  // Longueur minimum de 8 caractères
  .is().min(8)
  // Longueur maximum de 100 caractères
  .is().max(20)
  // Doit contenir au moins une lettre en majuscule
  .has().uppercase(1)
  // Doit contenir des lettres en minuscule
  .has().lowercase()
  // Doit contenir au moins un chiffre
  .has().digits(1)
  // Ne doit pas contenir d'espace
  .has().not().spaces()
  // Les valeurs étants sur liste noire
  .is().not().oneOf(['Passw0rd', 'Password123', 'Motdepasse0']);

module.exports = passwordSchema;