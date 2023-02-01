const DB = require("../utils/database");

module.exports = class dashSubscribers {
  // getting subscribers part in dashboard
  static subscribers() {
    return DB.execute(
      `
        SELECT * FROM blog_subscribers
      `
    );
  }
};
