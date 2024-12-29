const pool = require('./config/db');

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0]);
    }
    pool.end(); // Close the pool to end the script
});