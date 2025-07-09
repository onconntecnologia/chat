const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', chatRoutes);

// Rota de status
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});