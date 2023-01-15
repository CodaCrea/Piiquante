const multer = require('multer');
// Définir les extensions des images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// "diskStorage" configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
// "single()" crée un middleware qui capture les fichiers
// d'un certain type (passé en argument)
// et les enregistre au système de fichiers du serveur à l'aide du storage configuré
module.exports = multer({ storage }).single('image');