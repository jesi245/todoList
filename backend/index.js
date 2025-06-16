const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Selecciona el archivo .env correcto según el entorno (test o dev)
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

console.log(`🔍 Conectando a MongoDB en modo ${process.env.NODE_ENV}`);
console.log(`🔍 MONGODB_URI: ${process.env.MONGODB_URI}`);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

// Importar rutas
const taskRoutes = require('./routes/tasks');
app.use('/tasks', taskRoutes);

// Solo conectar si no está corriendo en test
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('🟢 Conectado a MongoDB');
      app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('🔴 Error al conectar a MongoDB:', error.message);
    });
}

module.exports = app;
