const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { Task } = require('../models/userModel');

dotenv.config(); 

/**
 * Middleware pour vérifier si l'utilisateur est authentifié via JWT
 */
const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Accès non autorisé, token requis" });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide" });
    }
};

/**
 * Middleware pour vérifier si une tâche existe avant modification ou suppression
 */
const checkTaskExists = async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findOne({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        req.task = task; 
        next();
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la vérification de la tâche" });
    }
};

/**
 * Middleware pour vérifier si l'utilisateur a le droit d'accéder/modifier une tâche spécifique
 */
const authorizeTaskAccess = (req, res, next) => {
    if (!req.task || req.task.userId !== req.user.id) {
        return res.status(403).json({ message: "Accès interdit à cette tâche" });
    }

    next();
};

module.exports = {
    authenticateUser,
    checkTaskExists,
    authorizeTaskAccess
};
