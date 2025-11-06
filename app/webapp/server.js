import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());

const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'employeesdb';

// Root route
app.get('/', (req, res) => {
  res.send('Employees app v2 running. Use GET /employees and POST /employees');
});

// Fetch all employees
app.get('/employees', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

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
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add new employee
app.post('/employees', async (req, res) => {
  const { name, role, department } = req.body;
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME
    });

    const [result] = await conn.query(
      'INSERT INTO employees (name, role, department) VALUES (?, ?, ?)',
      [name, role, department]
    );

    await conn.end();
    res.json({ message: 'Employee added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Employees app listening on port ${PORT}`);
});
