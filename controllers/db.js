import mysql from 'mysql2/promise';

let config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit : 10,
}

if (process.env.DB_SSL.toLowerCase() === "true") {
    config.ssl = {
        rejectUnauthorized: false
    }
}

const pool = mysql.createPool(config);

export default pool;