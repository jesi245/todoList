const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bbackend funcionando 🚀');
});

// Importar rutas
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Conectar a MongoDB y arrancar servidor
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('🟢 Conectado a MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('🔴 Error al conectar a MongoDB:', error.message);
});
