const mysql = require('mysql2/promise');

// Oppretter en pool for databasetilkoblinger
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Bytt til din MySQL-bruker
  password: '', // Bytt til ditt MySQL-passord
  database: 'dyreklinikk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;