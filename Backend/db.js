import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// crear la conexión a la base de datos utilizando un pool de conexiones
 export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});




