const DB = require("../utils/database");

module.exports = class users {
  // getting users part in dashboard
  static users() {
    return DB.execute(
      `
        SELECT * FROM blog_users
        `
    );
  }
};
