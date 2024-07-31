// lib/db.js
import mysql from 'mysql2/promise';

export const createConnection = async () => {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Summer99', // Replace with your MySQL root password
    database: 'WebDevsNest',
  });
};
