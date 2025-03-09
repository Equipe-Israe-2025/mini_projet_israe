const request = require('supertest');
const app = require('../app'); // Chemin corrigé : '../app'

describe('Task Routes', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'This is a test task' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Task created successfully');
  });

  it('should get tasks for the authenticated user', async () => {
    const res = await request(app)
      .get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tasks');
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tasks');
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put('/api/tasks/1')
      .send({ title: 'Updated Task', description: 'This is an updated task' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Task updated successfully');
  });

  it('should delete a task', async () => {
    const res = await request(app)
      .delete('/api/tasks/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Task deleted successfully');
  });
});