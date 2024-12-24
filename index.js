const express = require('express');
const util = require('util');
const db = require('./database'); // Importa il database
const app = express();
const PORT = 3000;

// Configura il motore di template Pug
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware per file statici e parsing del body
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));



// Converte `db.get` e `db.all` in versioni che supportano Promesse
db.getAsync = util.promisify(db.get);
db.allAsync = util.promisify(db.all);

app.get('/', (req, res) => {
    db.all('SELECT * FROM recensioni ORDER BY data_creazione DESC LIMIT 5', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Errore nel recupero delle recensioni');
      } else {
        res.render('index', { title: 'Home', active: 'home', recensioni: rows, currentPage: 0, totalPages: 0 });
      }
    });
  });
  
  app.get('/recensioni', async (req, res) => {
    try {
      const perPage = 5; // Numero di recensioni per pagina
      const page = parseInt(req.query.page) || 1; // Pagina corrente
      const offset = (page - 1) * perPage;
  
      // Ottieni il numero totale di recensioni
      const countResult = await db.getAsync('SELECT COUNT(*) AS total FROM recensioni');
      const total = countResult.total; // Totale delle recensioni
      const totalPages = Math.ceil(total / perPage); // Numero totale di pagine
  
      // Ottieni le recensioni della pagina corrente
      const rows = await db.allAsync(
        `SELECT * FROM recensioni ORDER BY data_creazione DESC LIMIT ? OFFSET ?`,
        [perPage, offset]
      );
  
      // Renderizza la pagina solo quando i dati sono pronti
      res.render('recensioni_listview', {
        title: 'Recensioni',
        active: 'recensioni',
        recensioni: rows,
        currentPage: page,
        totalPages: totalPages,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Errore nel recupero delle recensioni');
    }
  });
  
  
  

app.get('/nuova_recensione', (req, res) => {
    res.render('nuova_recensione', { title: 'Aggiungi Recensione' });
});

app.post('/nuova_recensione', async (req, res) => {
    const { titolo, descrizione, voto} = req.body;

    console.log("Dati ricevuti:", { titolo, descrizione, voto });

    db.run(
        'INSERT INTO recensioni (titolo, descrizione, voto) VALUES (?, ?, ?)',
        [titolo, descrizione, voto],
        function (err) {
            if (err) {
                console.error("Errore nell'inserimento:", err.message);
                return res.status(500).send('Errore durante il salvataggio della recensione');
            }
            console.log(`Recensione salvata con ID: ${this.lastID}`);
            res.redirect('/recensioni');
        }
    );
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
