const express = require('express');
const db = require('./database'); // Importa il database
const app = express();
const PORT = 3000;

// Configura il motore di template Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware per file statici e parsing del body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.render('index', { title: 'Home', active: 'home' });
});
  
app.get('/reviews', (req, res) => {
	db.all('SELECT * FROM records', [], (err, rows) => {
		if (err) {
		console.error(err.message);
		res.status(500).send('Errore nel recupero delle recensioni');
		} else {
		res.render('reviews', { title: 'Recensioni', active: 'reviews', reviews: rows });
		}
	});
});



// Rotta per aggiungere un record
app.post('/add', (req, res) => {
  const { title, description, image, rating } = req.body;

  // Inserisce un nuovo record nel database
  db.run(
    'INSERT INTO records (title, description, image, rating) VALUES (?, ?, ?, ?)',
    [title, description, image, parseInt(rating)],
    (err) => {
      if (err) {
        console.error('Errore durante l\'inserimento del record:', err.message);
        res.status(500).send('Errore del server');
      } else {
        res.redirect('/');
      }
    }
  );
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
