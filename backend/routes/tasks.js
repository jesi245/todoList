const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET todas las tareas
router.get('/', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// POST nueva tarea
router.post('/', async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title });
  await task.save();
  res.status(201).json(task);
});

// PUT actualizar tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
  res.json(task);
});

// DELETE eliminar tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Task.findByIdAndDelete(id);
  res.json({ message: 'Tarea eliminada' });
});

module.exports = router;
