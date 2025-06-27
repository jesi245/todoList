const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    if (req.metrics?.tasksLoadedCounter) {
      req.metrics.tasksLoadedCounter.inc();
    }
    res.json(tasks);
  } catch (error) {
    console.error('❌ Error en GET /tasks:', error);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// POST nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    await task.save();
    if (req.metrics?.tasksCreatedCounter) {
      req.metrics.tasksCreatedCounter.inc();
    }
    res.status(201).json(task);
  } catch (error) {
    console.error('❌ Error en POST /tasks:', error);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
});

// PUT actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });

    if (req.metrics) {
      if (completed === true) {
        req.metrics.tasksCompletedCounter?.inc();
      }
      if (title) {
        req.metrics.tasksUpdatedCounter?.inc();
      }
    }

    res.json(task);
  } catch (error) {
    console.error('❌ Error en PUT /tasks/:id:', error);
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
});

// DELETE eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    if (req.metrics?.tasksDeletedCounter) {
      req.metrics.tasksDeletedCounter.inc();
    }
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('❌ Error en DELETE /tasks/:id:', error);
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

module.exports = router;
