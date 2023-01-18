const DB = require("../utils/database");

module.exports = class Article {
  static CheckOutArtciles() {
    return DB.execute(
      `SELECT article_title,image_pathLocation,article_created_at,admin_img_path,tag_name 
      FROM blog_articles 
      JOIN blog_admins ON  blog_articles.author_id =blog_admins.admin_id 
      JOIN blog_tags ON blog_articles.tags_id = tag_id LIMIT 3 ;`
    );
  }
};
