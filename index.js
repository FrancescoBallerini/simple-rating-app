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
  
app.get('/recensioni', (req, res) => {
	db.all('SELECT * FROM recensioni', [], (err, rows) => {
		if (err) {
		console.error(err.message);
		res.status(500).send('Errore nel recupero delle recensioni');
		} else {
		res.render('recensioni_listview', { title: 'Recensioni', active: 'recensioni', recensioni: rows });
		}
	});
});

app.get('/recensione', (req, res) => {
    res.render('recensione', { titolo: 'Aggiungi Recensione' });
});

app.post('/recensione', async (req, res) => {
    const { titolo, descrizione, voto} = req.body; // Usa i campi definiti nel form

    // Verifica se i dati sono stati ricevuti correttamente
    console.log("Dati ricevuti:", { titolo, descrizione, voto });

    // Puoi aggiungere qui la logica per salvare la recensione nel database
    db.run(
        'INSERT INTO recensioni (titolo, descrizione, voto) VALUES (?, ?, ?)',
        [titolo, descrizione, voto],
        function (err) {
            if (err) {
                console.error("Errore nell'inserimento:", err.message);
                return res.status(500).send('Errore durante il salvataggio della recensione');
            }
            console.log(`Recensione salvata con ID: ${this.lastID}`);
            res.redirect('/recensioni'); // Reindirizza alla lista delle recensioni
        }
    );
});

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
