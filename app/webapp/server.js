import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 8080;

const DB_HOST = process.env.DB_HOST || 'mysql';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_NAME = process.env.DB_NAME || 'employeesdb';

app.get('/', (req, res) => {
  res.send('Employees app v2 running. Use GET /employees and POST /employees');
});

app.get('/employees', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME
    });
    const [rows] = await conn.query('CREATE TABLE IF NOT EXISTS employees(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(64));');
    const [rows2] = await conn.query('SELECT * FROM employees;');
    await conn.end();
    res.json(rows2);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.listen(PORT, () => {
  console.log(`Employees app listening on port ${PORT}`);
});
