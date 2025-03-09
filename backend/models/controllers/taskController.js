
const { createTask } = require('../models/taskModel');
const { getAllTasks } = require('../models/taskModel');
const { getTasksByUserId } = require('../models/taskModel');
const { updateTask } = require('../models/taskModel');
const { deleteTask } = require('../models/taskModel');


// Create task
exports.createTask = async (req, res) => {
    const { taskName, dateEnd } = req.body;
    const userId = req.userId; // Récupéré depuis le middleware d'authentification

    try {
        // Créer la tâche dans la base de données
        const task = await createTask(userId, taskName, dateEnd);

        // Renvoyer la réponse
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la tâche', error });
    }
};

// Display All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        // Récupérer toutes les tâches depuis la base de données
        const tasks = await getAllTasks();

        // Renvoyer la réponse
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error });
    }
};

// Display a specific task

exports.getTasks = async (req, res) => {
    const userId = req.userId; // Récupéré depuis le middleware d'authentification

    try {
        // Récupérer les tâches de l'utilisateur
        const tasks = await getTasksByUserId(userId);

        // Renvoyer la réponse
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error });
    }
};



// Update task
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { taskName, dateEnd} = req.body;
    const userId = req.userId; // Récupéré depuis le middleware d'authentification

    try {
        // Mettre à jour la tâche dans la base de données
        const task = await updateTask(id, userId, taskName, dateEnd);

        // Renvoyer la réponse
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error });
    }
};

// Delete task
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; // Récupéré depuis le middleware d'authentification

    try {
        // Supprimer la tâche dans la base de données
        await deleteTask(id, userId);

        // Renvoyer la réponse
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error });
    }
};