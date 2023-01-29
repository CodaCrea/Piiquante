const multer = require('multer');
// Définir les extensions des images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Limite à 1mb
const maxSize = 1 * 1024 * 1024;
const imageFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback("Valide", true);
  } else {
    callback("Ne télécharger que des images", false);
  }
  console.log(callback);
};
// "diskStorage" configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const cleanName = name.split('.');
    console.log(cleanName);
    const extension = MIME_TYPES[file.mimetype];
    callback(null, cleanName[0] + Date.now() + '.' + extension);
  }
});
// "single()" crée un middleware qui capture les fichiers
// d'un certain type (passé en argument)
// et les enregistre au système de fichiers du serveur à l'aide du storage configuré
module.exports = multer({ storage: storage, limits: { file: 1, fileSize: maxSize }, fileFilter: imageFilter }).single('image');