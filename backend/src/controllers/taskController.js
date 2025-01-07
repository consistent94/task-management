const pool = require('../config/db');

const taskController = {
    // Get all tasks for a user
    async getTasks(req, res) {
        try {
            const result = await pool.query(
                `SELECT 
                    t.*,
                    u.username as assignee_name,
                    c.username as creator_name
                FROM tasks t
                LEFT JOIN users u ON t.assignee_id = u.id
                LEFT JOIN users c ON t.created_by = c.id
                WHERE t.created_by = $1 OR t.assignee_id = $1
                ORDER BY t.created_at DESC`,
                [req.user.id]
            );

            res.json(result.rows);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Create a new task
    async createTask(req, res) {
        try {
            const { title, description, status, priority, due_date, assignee_id } = req.body;
            
            const result = await pool.query(
                `INSERT INTO tasks 
                (title, description, status, priority, due_date, created_by, assignee_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *`,
                [title, description, status, priority, due_date, req.user.id, assignee_id]
            );

            const task = result.rows[0];

            // Get assignee details
            const assigneeResult = await pool.query(
                'SELECT username FROM users WHERE id = $1',
                [assignee_id]
            );

            task.assignee_name = assigneeResult.rows[0]?.username;
            task.creator_name = req.user.username;

            res.status(201).json(task);
        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Update a task
    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const { title, description, status, priority, due_date, assignee_id } = req.body;

            // Check if task exists and user has permission
            const taskCheck = await pool.query(
                'SELECT * FROM tasks WHERE id = $1 AND (created_by = $2 OR assignee_id = $2)',
                [id, req.user.id]
            );

            if (taskCheck.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found or unauthorized' });
            }

            const result = await pool.query(
                `UPDATE tasks 
                SET title = $1, description = $2, status = $3, priority = $4, 
                    due_date = $5, assignee_id = $6
                WHERE id = $7
                RETURNING *`,
                [title, description, status, priority, due_date, assignee_id, id]
            );

            res.json(result.rows[0]);
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    // Delete a task
    async deleteTask(req, res) {
        try {
            const { id } = req.params;

            // Check if task exists and user has permission
            const result = await pool.query(
                'DELETE FROM tasks WHERE id = $1 AND created_by = $2 RETURNING *',
                [id, req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Task not found or unauthorized' });
            }

            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = taskController;