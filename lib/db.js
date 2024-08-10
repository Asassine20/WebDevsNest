import mysql from 'mysql2/promise';

export const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD, // Replace with your MySQL root password
    database: process.env.MYSQL_DATABASE,
  });
};

export const query = async (q, values) => {
  const connection = await createConnection();
  const [results] = await connection.execute(q, values);
  await connection.end();
  return results;
};
