//======================USER CONTROLLERS========================//

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser } = require('../models/userModel');
const { findUserByUsername } = require('../models/userModel');

// Inscrire un nouvel utilisateur.
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Hacher le mot de passe
        const passwordHash = await bcrypt.hash(password, 10);

        // Créer l'utilisateur dans la base de données
        const user = await createUser(username, passwordHash);

        // Générer un token JWT
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET ,{expiresIn: '1h'});
        // Renvoyer la réponse
        res.status(201).json({user, token});
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
    }
};
//connecter un utilisateur existant.
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Trouver l'utilisateur dans la base de données
        const user = await findUserByUsername(username);

        // Vérifier si l'utilisateur existe et si le mot de passe est correct
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ,{expiresIn: '1h'});

        // Renvoyer la réponse
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error });
    }
};