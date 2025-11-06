import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Database configuration
const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'employeesdb';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // Serve index.html and static files

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET /employees → Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    // Ensure table exists
    await conn.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        role VARCHAR(100),
        department VARCHAR(100)
      );
    `);

    const [rows] = await conn.query('SELECT * FROM employees;');
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /employees → Add a new employee
app.post('/employees', async (req, res) => {
  const { name, role, department } = req.body;

  if (!name || !role || !department) {
    return res.status(400).json({ error: 'All fields (name, role, department) are required' });
  }

  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    const [result] = await conn.query(
      'INSERT INTO employees (name, role, department) VALUES (?, ?, ?);',
      [name, role, department]
    );
    await conn.end();

    res.status(201).json({ message: 'Employee added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding employee:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Employees app listening on port ${PORT}`);
});

