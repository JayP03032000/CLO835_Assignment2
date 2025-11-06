const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));  // 👈 serve index.html from same folder

const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'mysql.db.svc.cluster.local';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'employeesdb';

// Connect to MySQL
async function getConnection() {
  return mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });
}

// Root route — serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));  
});

// API — Get all employees
app.get('/employees', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT * FROM employees');
    res.json(rows);
    await conn.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API — Add new employee
app.post('/employees', async (req, res) => {
  const { name, role, department } = req.body;
  try {
    const conn = await getConnection();
    await conn.query('INSERT INTO employees (name, role, department) VALUES (?, ?, ?)', [name, role, department]);
    res.json({ message: 'Employee added successfully' });
    await conn.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
