const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, getAllTasks } = require('../controllers/taskController');
const {authenticateUser, checkTaskExists, authorizeTaskAccess } = require('../middleware/authMiddleware');

const router = express.Router();

//router.use(authMiddleware);

router.post('/', authenticateUser, createTask);
router.get('/', authenticateUser, getTasks);
router.get('/all', getAllTasks); // Nouvelle route pour récupérer toutes les tâches
router.put('/:id', authenticateUser, checkTaskExists, authorizeTaskAccess, updateTask);
router.delete('/:id',authenticateUser, checkTaskExists, authorizeTaskAccess, deleteTask);

module.exports = router;