const axios = require('axios');
require('dotenv').config();

const n8nUrl = process.env.N8N_URL;
const n8nApiKey = process.env.N8N_API_KEY;

if (!n8nUrl) {
  console.error('n8n URL is missing. Please check your .env file.');
  process.exit(1);
}

const n8nClient = axios.create({
  baseURL: n8nUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(n8nApiKey && { 'X-N8N-API-KEY': n8nApiKey }),
  },
});

module.exports = n8nClient;