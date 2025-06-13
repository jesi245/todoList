const request = require('supertest');
const app = require('../index');
const mongoose = require('mongoose');
const Task = require('../models/Task');

describe('API /tasks', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  test('GET /tasks debería devolver un array vacío inicialmente', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /tasks debería crear una tarea', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'Test tarea' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test tarea');
  });

  test('PUT /tasks/:id debería actualizar una tarea', async () => {
    const tareaCreada = await Task.create({ title: 'Tarea a actualizar' });
    const res = await request(app)
      .put(`/tasks/${tareaCreada._id}`)
      .send({ title: 'Tarea actualizada', completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Tarea actualizada');
    expect(res.body.completed).toBe(true);
  });

  test('DELETE /tasks/:id debería eliminar una tarea', async () => {
    const tareaCreada = await Task.create({ title: 'Tarea a eliminar' });
    const res = await request(app).delete(`/tasks/${tareaCreada._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Tarea eliminada');

    const tareaBuscada = await Task.findById(tareaCreada._id);
    expect(tareaBuscada).toBeNull();
  });
});
