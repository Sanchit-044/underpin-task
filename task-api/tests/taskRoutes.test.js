const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');


beforeEach(() => {
  taskService._reset();
});

test('POST /tasks should create task', async () => {
  const res = await request(app)
    .post('/tasks')
    .send({ title: 'Test Task' });

  expect(res.statusCode).toBe(201);
  expect(res.body.title).toBe('Test Task');
});

test('GET /tasks should return tasks', async () => {
  const res = await request(app).get('/tasks');
  expect(res.statusCode).toBe(200);
});

test('PUT /tasks/:id should update task', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Old' });

  const res = await request(app)
    .put(`/tasks/${create.body.id}`)
    .send({ title: 'New' });

  expect(res.body.title).toBe('New');
});

test('DELETE /tasks/:id should delete task', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Del' });

  const res = await request(app).delete(`/tasks/${create.body.id}`);

  expect(res.statusCode).toBe(204);
});

test('should return 404 for invalid id', async () => {
  const res = await request(app).get('/tasks/invalid-id');
  expect(res.statusCode).toBe(404);
});