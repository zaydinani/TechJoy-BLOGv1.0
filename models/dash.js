const DB = require("../utils/database");

module.exports = class dash {
  /* getting articles part in dashboard */
  static articles() {
    return DB.execute(
      `
      SELECT 
        admin_username,
        article_id,
        article_title,  
        image_pathLocation,  
        article_created_at
      FROM blog_admins
      JOIN blog_articles
      ON blog_admins.admin_id = blog_articles.author_id
      `
    );
  }
};
