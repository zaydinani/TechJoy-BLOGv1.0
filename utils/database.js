const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: process.env.DB,
  password: process.env.PASSWORD,
});

module.exports = pool.promise();
