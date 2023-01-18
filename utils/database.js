const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "tech_joy",
  password: "Mtm2022!4L",
});

module.exports = pool.promise();
