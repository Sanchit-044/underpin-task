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

test('should assign task to a user', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Task' });

  const res = await request(app)
    .patch(`/tasks/${create.body.id}/assign`)
    .send({ assignee: 'Sanchit' });

  expect(res.statusCode).toBe(200);
  expect(res.body.assignee).toBe('Sanchit');
});

test('should return 400 for empty assignee', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Task' });

  const res = await request(app)
    .patch(`/tasks/${create.body.id}/assign`)
    .send({ assignee: '' });

  expect(res.statusCode).toBe(400);
});

test('should return 404 for invalid task id', async () => {
  const res = await request(app)
    .patch('/tasks/invalid-id/assign')
    .send({ assignee: 'Sanchit' });

  expect(res.statusCode).toBe(404);
});

test('should fail when title is missing', async () => {
  const res = await request(app)
    .post('/tasks')
    .send({});

  expect(res.statusCode).toBe(400);
});

test('should return 404 when deleting invalid id', async () => {
  const res = await request(app).delete('/tasks/invalid-id');
  expect(res.statusCode).toBe(404);
});

test('should mark task as complete', async () => {
  const create = await request(app).post('/tasks').send({ title: 'Task' });

  const res = await request(app)
    .patch(`/tasks/${create.body.id}/complete`);

  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('done');
});


test('should filter and paginate together', async () => {
  for (let i = 0; i < 10; i++) {
    await request(app).post('/tasks').send({
      title: `Task ${i}`,
      status: i < 5 ? 'todo' : 'done'
    });
  }

  const res = await request(app).get('/tasks?status=todo&page=1&limit=3');

  expect(res.body.length).toBe(3);
  expect(res.body.every(t => t.status === 'todo')).toBe(true);
});