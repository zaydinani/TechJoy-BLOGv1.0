const DB = require("../utils/database");

module.exports = class admins {
  /* getting admins part in dashboard */
  static admins() {
    return DB.execute(
      `
      SELECT 
        admin_id,
        admin_username,
        admin_email
        FROM blog_admins
      `
    );
  }
};
