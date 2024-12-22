const sqlite3 = require('sqlite3').verbose();

// Crea o collega il database
const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Errore durante la connessione al database:', err.message);
  } else {
    console.log('Connesso al database SQLite.');
  }
});

// Crea la tabella "records" se non esiste
db.run(`
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    rating INTEGER NOT NULL
  )
`);

module.exports = db;
