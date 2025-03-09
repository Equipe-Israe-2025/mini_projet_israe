const pool = require('../config/db')

//Crée une nouvelle tâche.
exports.createTask= async(userId, taskName, dateEnd)=>{
    try {
        const{rows}=await pool.query(
            'INSERT INTO tasks (user_id, "taskName", "dateEnd") VALUES ($1,$2,$3) RETURNING *',
            [userId, taskName, dateEnd]
        );
        return rows[0];
    } catch (error) {
        console.error('Error SQL: ', error);
        throw error;
    }
};
// Récupère les tâches d'un utilisateur.
exports.getTasksByUserId=async(userId)=>{
    const {rows}=await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1',
        [userId]
    );
    return rows;
};

// Récupérer toutes les tâches
exports.getAllTasks = async () => {
    const { rows } = await pool.query('SELECT * FROM tasks');
    return rows;
};

//Met à jour une tâche existante.
exports.updateTask = async (id, userId, taskName, dateEnd) => {
    const { rows } = await pool.query(
        'UPDATE tasks SET "taskName" = $1, "dateEnd" = $2, WHERE id = $4 AND user_id = $5 RETURNING *',
        [taskName, dateEnd, id, userId]
    );
    return rows[0];
};
//Supprime une tâche existante.
exports.deleteTask = async (id, userId) => {
    await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
};