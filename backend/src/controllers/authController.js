const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Controller for handling authentication-related operations.
 * 
 * Methods:
 * - register: Registers a new user.
 * - login: Logs in an existing user.
 * - getCurrentUser: Retrieves the currently authenticated user's information.
 */
const authController = {
    // Register a new user
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const userExists = await db.query(
                'SELECT * FROM users WHERE email = $1 OR username = $2',
                [email, username]
            );

            if (userExists.rows.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const newUser = await db.query(
                'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
                [username, email, hashedPassword]
            );

            // Create JWT token
            const token = jwt.sign(
                { id: newUser.rows[0].id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                user: newUser.rows[0],
                token
            });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const result = await db.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );

            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password_hash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Create token
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Get current user
    async getCurrentUser(req, res) {
        try {
            const result = await db.query(
                'SELECT id, username, email FROM users WHERE id = $1',
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = authController;