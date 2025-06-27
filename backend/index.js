const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const client = require('prom-client');
const Metric = require('./models/Metric');

const app = express();
const PORT = process.env.PORT || 3000;

// Cargar archivo .env correcto
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

console.log(`🔍 Conectando a MongoDB en modo ${process.env.NODE_ENV}`);
console.log(`🔍 MONGODB_URI: ${process.env.MONGODB_URI}`);

// Middleware
app.use(cors());
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('Backend funcionando con métricas');
});

// Ruta de métricas (siempre disponible)
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Variables para contadores (solo se crean si no estamos en test)
let tasksCreatedCounter, tasksDeletedCounter, tasksCompletedCounter, tasksLoadedCounter, tasksUpdatedCounter;

// Si no estamos en test, conectar a Mongo y crear contadores de métricas
if (process.env.NODE_ENV !== 'test') {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  async function createPersistentCounter(name, help) {
    const stored = await Metric.findOne({ name });
    const initialValue = stored ? stored.value : 0;

    const counter = new client.Counter({ name, help, registers: [client.register] });

    const originalInc = counter.inc.bind(counter);
    counter.inc = async function (value = 1) {
      originalInc(value);
      await Metric.findOneAndUpdate({ name }, { $inc: { value } }, { upsert: true, new: true });
    };

    if (initialValue > 0) {
      originalInc(initialValue);
    }

    return counter;
  }

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('🟢 Conectado a MongoDB');

      // Crear contadores de métricas persistentes
      tasksCreatedCounter = await createPersistentCounter('tasks_created_total', 'Total de tareas creadas');
      tasksDeletedCounter = await createPersistentCounter('tasks_deleted_total', 'Total de tareas eliminadas');
      tasksCompletedCounter = await createPersistentCounter('tasks_completed_total', 'Total de tareas completadas');
      tasksLoadedCounter = await createPersistentCounter('tasks_loaded_total', 'Tareas consultadas desde la base de datos');
      tasksUpdatedCounter = await createPersistentCounter('tasks_updated_total', 'Total de tareas editadas');

      app.listen(PORT, () => {
        console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('🔴 Error al conectar a MongoDB:', error.message);
    });
}

// Cargar rutas de tareas (funciona también en modo test)
const taskRoutes = require('./routes/tasks');

app.use('/tasks', (req, res, next) => {
  // En test, no inyectamos métricas
  if (process.env.NODE_ENV === 'test') {
    return taskRoutes(req, res, next);
  }

  // En producción, inyectamos contadores (si existen)
  req.metrics = {
    tasksCreatedCounter,
    tasksDeletedCounter,
    tasksCompletedCounter,
    tasksLoadedCounter,
    tasksUpdatedCounter
  };
  return taskRoutes(req, res, next);
});

process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM recibido: apagando backend...');
  process.exit(0);
});

module.exports = app;


