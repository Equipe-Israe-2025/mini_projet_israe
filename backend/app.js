const express = require('express');
const cors = require('cors'); // Ajout de CORS pour gérer les requêtes cross-origin
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse les requêtes JSON

// Routes
app.use('/api/tasks', taskRoutes); // Routes pour les tâches
app.use('/api/users', userRoutes); // Routes pour les utilisateurs

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});