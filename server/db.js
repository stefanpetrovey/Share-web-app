const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'expressproject2Db',
  password: 'Sakamajfon11@',
  port: 5435,
});

pool.on('connect', () => {
  console.log('PostgreSQL connected');
});

module.exports = pool;
