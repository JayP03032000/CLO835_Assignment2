import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'employeesdb';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Employees app running. Use GET /employees and POST /employees to view or add data.');
});

app.get('/employees', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    const [rows] = await conn.query('SELECT * FROM employees;');
    await conn.end();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/employees', async (req, res) => {
  const { name, role, department } = req.body;
  if (!name || !role || !department) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    await conn.query(
      'INSERT INTO employees (name, role, department) VALUES (?, ?, ?)',
      [name, role, department]
    );
    await conn.end();
    res.json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Employees app listening on port ${PORT}`);
});

