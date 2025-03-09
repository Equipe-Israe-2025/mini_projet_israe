// taskController.test.js
const taskController = require('./taskController');
const { createTask, getAllTasks, getTasksByUserId, updateTask, deleteTask } = require('./models/taskModel');

// Mock des dépendances
jest.mock('./models/taskModel');

describe('Task Controller', () => {
    let req, res;

    beforeEach(() => {
        // Réinitialiser les mocks avant chaque test
        jest.clearAllMocks();

        // Simuler les objets req et res
        req = {
            body: {},
            params: {},
            userId: 1 // Simuler un utilisateur authentifié
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    // Tests pour createTask
    describe('createTask', () => {
        it('should create a task and return 201 status', async () => {
            // Données simulées
            req.body = {
                title: 'Test Task',
                description: 'This is a test task'
            };

            // Simuler la création de la tâche
            createTask.mockResolvedValue({ id: 1, userId: 1, title: 'Test Task', description: 'This is a test task' });

            // Appeler la fonction createTask
            await taskController.createTask(req, res);

            // Vérifier les résultats
            expect(createTask).toHaveBeenCalledWith(1, 'Test Task', 'This is a test task');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, title: 'Test Task', description: 'This is a test task' });
        });

        it('should return 500 status if task creation fails', async () => {
            // Simuler une erreur
            req.body = {
                title: 'Test Task',
                description: 'This is a test task'
            };
            createTask.mockRejectedValue(new Error('Database error'));

            // Appeler la fonction createTask
            await taskController.createTask(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la création de la tâche', error: expect.any(Error) });
        });
    });

    // Tests pour getAllTasks
    describe('getAllTasks', () => {
        it('should return all tasks', async () => {
            // Simuler la récupération des tâches
            getAllTasks.mockResolvedValue([
                { id: 1, userId: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, userId: 2, title: 'Task 2', description: 'Description 2' }
            ]);

            // Appeler la fonction getAllTasks
            await taskController.getAllTasks(req, res);

            // Vérifier les résultats
            expect(getAllTasks).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith([
                { id: 1, userId: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, userId: 2, title: 'Task 2', description: 'Description 2' }
            ]);
        });

        it('should return 500 status if fetching tasks fails', async () => {
            // Simuler une erreur
            getAllTasks.mockRejectedValue(new Error('Database error'));

            // Appeler la fonction getAllTasks
            await taskController.getAllTasks(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération des tâches', error: expect.any(Error) });
        });
    });

    // Tests pour getTasks
    describe('getTasks', () => {
        it('should return tasks for a specific user', async () => {
            // Simuler la récupération des tâches de l'utilisateur
            getTasksByUserId.mockResolvedValue([
                { id: 1, userId: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, userId: 1, title: 'Task 2', description: 'Description 2' }
            ]);

            // Appeler la fonction getTasks
            await taskController.getTasks(req, res);

            // Vérifier les résultats
            expect(getTasksByUserId).toHaveBeenCalledWith(1);
            expect(res.json).toHaveBeenCalledWith([
                { id: 1, userId: 1, title: 'Task 1', description: 'Description 1' },
                { id: 2, userId: 1, title: 'Task 2', description: 'Description 2' }
            ]);
        });

        it('should return 500 status if fetching user tasks fails', async () => {
            // Simuler une erreur
            getTasksByUserId.mockRejectedValue(new Error('Database error'));

            // Appeler la fonction getTasks
            await taskController.getTasks(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la récupération des tâches', error: expect.any(Error) });
        });
    });

    // Tests pour updateTask
    describe('updateTask', () => {
        it('should update a task and return the updated task', async () => {
            // Données simulées
            req.params = { id: '1' };
            req.body = {
                title: 'Updated Task',
                description: 'Updated Description',
                completed: true
            };

            // Simuler la mise à jour de la tâche
            updateTask.mockResolvedValue({ id: 1, userId: 1, title: 'Updated Task', description: 'Updated Description', completed: true });

            // Appeler la fonction updateTask
            await taskController.updateTask(req, res);

            // Vérifier les résultats
            expect(updateTask).toHaveBeenCalledWith('1', 1, 'Updated Task', 'Updated Description', true);
            expect(res.json).toHaveBeenCalledWith({ id: 1, userId: 1, title: 'Updated Task', description: 'Updated Description', completed: true });
        });

        it('should return 500 status if updating task fails', async () => {
            // Simuler une erreur
            req.params = { id: '1' };
            req.body = {
                title: 'Updated Task',
                description: 'Updated Description',
                completed: true
            };
            updateTask.mockRejectedValue(new Error('Database error'));

            // Appeler la fonction updateTask
            await taskController.updateTask(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la mise à jour de la tâche', error: expect.any(Error) });
        });
    });

    // Tests pour deleteTask
    describe('deleteTask', () => {
        it('should delete a task and return 204 status', async () => {
            // Données simulées
            req.params = { id: '1' };

            // Simuler la suppression de la tâche
            deleteTask.mockResolvedValue();

            // Appeler la fonction deleteTask
            await taskController.deleteTask(req, res);

            // Vérifier les résultats
            expect(deleteTask).toHaveBeenCalledWith('1', 1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalled();
        });

        it('should return 500 status if deleting task fails', async () => {
            // Simuler une erreur
            req.params = { id: '1' };
            deleteTask.mockRejectedValue(new Error('Database error'));

            // Appeler la fonction deleteTask
            await taskController.deleteTask(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la suppression de la tâche', error: expect.any(Error) });
        });
    });
});