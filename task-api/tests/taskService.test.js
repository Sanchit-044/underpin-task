const taskService = require('../src/services/taskService');

beforeEach(() => {
  taskService._reset();
});

test('should create a task', () => {
  const task = taskService.create({ title: 'Test Task' });

  expect(task).toHaveProperty('id');
  expect(task.title).toBe('Test Task');
  expect(task.status).toBe('todo');
});

test('should return all tasks', () => {
  taskService.create({ title: 'Task 1' });
  taskService.create({ title: 'Task 2' });

  const tasks = taskService.getAll();
  expect(tasks.length).toBe(2);
});

test('should update a task', () => {
  const task = taskService.create({ title: 'Old' });

  const updated = taskService.update(task.id, { title: 'New' });

  expect(updated.title).toBe('New');
});

test('should delete a task', () => {
  const task = taskService.create({ title: 'Delete me' });

  const result = taskService.remove(task.id);
  expect(result).toBe(true);
});

test('should mark task as complete', () => {
  const task = taskService.create({ title: 'Complete me' });

  const updated = taskService.completeTask(task.id);

  expect(updated.status).toBe('done');
  expect(updated.completedAt).not.toBeNull();
});

test('should return null when updating non-existent task', () => {
  const result = taskService.update('invalid-id', { title: 'X' });
  expect(result).toBeNull();
});