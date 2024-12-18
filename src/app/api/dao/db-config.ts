import * as sql from "mssql";
import "dotenv/config";

import dotenv from 'dotenv';
dotenv.config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_HOST,
  port: process.env.DB_PORT,
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
};

const connectionString = `Server=${config.server},${config.port};Database=${config.database};User Id=${config.user};Password=${config.password};Encrypt=false`;

export const database = new sql.ConnectionPool(connectionString);

// Connect to the database and handle errors
database.connect()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

// Optionally, listen for other events (e.g., pool errors)
database.on("error", (err) => {
  console.error("SQL Connection Pool Error:", err.message);
});