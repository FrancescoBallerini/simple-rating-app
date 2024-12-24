const multer = require('multer');
const path = require('path');

// Configura lo storage per salvare i file in locale
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/static/image'); // Cartella dove salvare le immagini
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configura il filtro per accettare solo immagini
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Sono accettati solo file immagine (jpeg, jpg, png, gif)'));
  }
};

// Esporta la configurazione di multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
