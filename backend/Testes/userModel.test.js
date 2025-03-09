const { createUser, findUserByUsername } = require('./userModel'); // Import the functions
const pool = require('../config/db'); // Import the pool

// Mock the pool object
jest.mock('../config/db', () => ({
    query: jest.fn(),
}));

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    describe('createUser', () => {
        it('should create a new user and return the user object', async () => {
            const mockUser = { id: 1, username: 'testuser', password_hash: 'hashedpassword' };
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await createUser('testuser', 'hashedpassword');

            expect(pool.query).toHaveBeenCalledWith(
                'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
                ['testuser', 'hashedpassword']
            );
            expect(result).toEqual(mockUser);
        });
    });

    describe('findUserByUsername', () => {
        it('should find a user by username and return the user object', async () => {
            const mockUser = { id: 1, username: 'testuser', password_hash: 'hashedpassword' };
            pool.query.mockResolvedValueOnce({ rows: [mockUser] });

            const result = await findUserByUsername('testuser');

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = $1',
                ['testuser']
            );
            expect(result).toEqual(mockUser);
        });

        it('should return undefined if the user is not found', async () => {
            pool.query.mockResolvedValueOnce({ rows: [] });

            const result = await findUserByUsername('nonexistentuser');

            expect(pool.query).toHaveBeenCalledWith(
                'SELECT * FROM users WHERE username = $1',
                ['nonexistentuser']
            );
            expect(result).toBeUndefined();
        });
    });
});