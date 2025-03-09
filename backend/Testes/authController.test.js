// authController.test.js
const authController = require('./authController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('./models/userModel'); // Chemin corrigé

// Mock des dépendances
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('./models/userModel'); // Chemin corrigé

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        // Réinitialiser les mocks avant chaque test
        jest.clearAllMocks();

        // Simuler les objets req et res
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(), // Permet de chaîner les appels (ex: res.status(201).json(...))
            json: jest.fn()
        };
    });

    // Tests pour la fonction register
    describe('register', () => {
        it('should register a new user and return 201 status', async () => {
            // Données simulées
            req.body = {
                username: 'testuser',
                password: 'testpassword'
            };

            // Simuler le hachage du mot de passe
            bcrypt.hash.mockResolvedValue('hashedpassword');

            // Simuler la création de l'utilisateur
            createUser.mockResolvedValue({ id: 1, username: 'testuser', password_hash: 'hashedpassword' });

            // Appeler la fonction register
            await authController.register(req, res);

            // Vérifier les résultats
            expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10); // Vérifie que bcrypt.hash est appelé avec les bons arguments
            expect(createUser).toHaveBeenCalledWith('testuser', 'hashedpassword'); // Vérifie que createUser est appelé avec les bons arguments
            expect(res.status).toHaveBeenCalledWith(201); // Vérifie que le statut HTTP 201 est renvoyé
            expect(res.json).toHaveBeenCalledWith({ id: 1, username: 'testuser', password_hash: 'hashedpassword' }); // Vérifie la réponse JSON
        });

        it('should return 500 status if registration fails', async () => {
            // Simuler une erreur
            req.body = {
                username: 'testuser',
                password: 'testpassword'
            };
            bcrypt.hash.mockRejectedValue(new Error('Hashing failed')); // Simuler une erreur de hachage

            // Appeler la fonction register
            await authController.register(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut HTTP 500 est renvoyé
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de l\'inscription', error: expect.any(Error) }); // Vérifie la réponse JSON
        });
    });

    // Tests pour la fonction login
    describe('login', () => {
        it('should login a user and return a token', async () => {
            // Données simulées
            req.body = {
                username: 'testuser',
                password: 'testpassword'
            };

            // Simuler la recherche de l'utilisateur
            findUserByUsername.mockResolvedValue({
                id: 1,
                username: 'testuser',
                password_hash: 'hashedpassword'
            });

            // Simuler la comparaison de mot de passe
            bcrypt.compare.mockResolvedValue(true);

            // Simuler la génération du token
            jwt.sign.mockReturnValue('fakeToken');

            // Appeler la fonction login
            await authController.login(req, res);

            // Vérifier les résultats
            expect(findUserByUsername).toHaveBeenCalledWith('testuser'); // Vérifie que findUserByUsername est appelé avec le bon argument
            expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword'); // Vérifie que bcrypt.compare est appelé avec les bons arguments
            expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Vérifie que jwt.sign est appelé avec les bons arguments
            expect(res.json).toHaveBeenCalledWith({ token: 'fakeToken' }); // Vérifie la réponse JSON
        });

        it('should return 401 status if credentials are invalid', async () => {
            // Données simulées
            req.body = {
                username: 'testuser',
                password: 'testpassword'
            };

            // Simuler un utilisateur non trouvé
            findUserByUsername.mockResolvedValue(null);

            // Appeler la fonction login
            await authController.login(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(401); // Vérifie que le statut HTTP 401 est renvoyé
            expect(res.json).toHaveBeenCalledWith({ message: 'Identifiants invalides' }); // Vérifie la réponse JSON
        });

        it('should return 500 status if login fails', async () => {
            // Simuler une erreur
            req.body = {
                username: 'testuser',
                password: 'testpassword'
            };
            findUserByUsername.mockRejectedValue(new Error('Database error')); // Simuler une erreur de base de données

            // Appeler la fonction login
            await authController.login(req, res);

            // Vérifier les résultats
            expect(res.status).toHaveBeenCalledWith(500); // Vérifie que le statut HTTP 500 est renvoyé
            expect(res.json).toHaveBeenCalledWith({ message: 'Erreur lors de la connexion', error: expect.any(Error) }); // Vérifie la réponse JSON
        });
    });
});