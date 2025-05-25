require('dotenv').config(); 
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.CONNECTION_URL,
  ssl: {
    rejectUnauthorized: false,  // 👈 allow self-signed cert
  },
});

client.connect()
  .then(() => console.log('Connected to Supabase PostgreSQL'))
  .catch(err => console.error('Connection error:', err.stack));

module.exports = client;
