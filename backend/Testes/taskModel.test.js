const { createTask, getTasksByUserId, getAllTasks, updateTask, deleteTask } = require('./taskModel');
const pool = require('../config/db');

// Mock de l'objet pool
jest.mock('../config/db', () => ({
    query: jest.fn(),
}));

describe('Task Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
    });

    describe('createTask', () => {
        it('should create a new task and return the task object', async () => {
            const mockTask = { id: 1, user_id: 1, title: 'Test Task', description: 'Test Description' };
            pool.query.mockResolvedValueOnce({ rows: [mockTask] });

            const result = await createTask(1, 'Test Task', 'Test Description');

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
                [1, 'Test Task', 'Test Description']
            );
            expect(result).toEqual(mockTask);
        });
    });

    describe('getTasksByUserId', () => {
        it('should return tasks for a specific user', async () => {
            const mockTasks = [
                { id: 1, user_id: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, user_id: 1, title: 'Task 2', description: 'Description 2' },
            ];
            pool.query.mockResolvedValueOnce({ rows: mockTasks });

            const result = await getTasksByUserId(1);

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM tasks WHERE user_id = $1',
                [1]
            );
            expect(result).toEqual(mockTasks);
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            const mockTasks = [
                { id: 1, user_id: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, user_id: 2, title: 'Task 2', description: 'Description 2' },
            ];
            pool.query.mockResolvedValueOnce({ rows: mockTasks });

            const result = await getAllTasks();

            expect(pool.query).toHaveBeenCalledWith('SELECT * FROM tasks');
            expect(result).toEqual(mockTasks);
        });
    });

    describe('updateTask', () => {
        it('should update a task and return the updated task object', async () => {
            const mockTask = { id: 1, user_id: 1, title: 'Updated Task', description: 'Updated Description', completed: true };
            pool.query.mockResolvedValueOnce({ rows: [mockTask] });

            const result = await updateTask(1, 1, 'Updated Task', 'Updated Description', true);

            expect(pool.query).toHaveBeenCalledWith(
                'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
                ['Updated Task', 'Updated Description', true, 1, 1]
            );
            expect(result).toEqual(mockTask);
        });
    });

    describe('deleteTask', () => {
        it('should delete a task', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            await deleteTask(1, 1);

            expect(pool.query).toHaveBeenCalledWith(
                'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
                [1, 1]
            );
        });
    });
});