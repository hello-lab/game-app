const Database =require( 'better-sqlite3');

const db = new Database('users.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    balance INTEGER DEFAULT 0,
    transactions TEXT,
    password TEXT
  )
`);

export default db;
