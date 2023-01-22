const dash = require("../models/dash");
const subscribers = require("../models/subscribers");
const users = require("../models/user");
const DB = require("../utils/database");

// get route for Create new Article

exports.getNewArticle = (req, res) => {
  DB.execute(`SELECT * FROM blog_tags`)
    .then(([rows, fieldData]) => {
      // * Getting tags info from database
      const tags = rows;
      DB.execute(`SELECT admin_id,admin_username FROM blog_admins`)
        .then(([admin_rows, fieldData]) => {
          // * Getting admin info from database
          res.render("new-article", {
            isLoggedIn: req.session.isLoggedIn,
            admin_rows: admin_rows,
            tags: tags,
            articleData: false,
            editMode: false,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

/*get articles data */
exports.getArticles = (req, res, next) => {
  dash
    .articles()
    .then(([rows, fieldData]) => {
      res.render("dash", {
        articles: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/* get subscribers data */
exports.getSubscribers = (req, res, next) => {
  subscribers
    .subscribers()
    .then(([rows, fieldData]) => {
      res.render("subscribers", {
        subscribers: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//*get users data
exports.getUsers = (req, res, next) => {
  users
    .users()
    .then(([rows, fieldData]) => {
      res.render("users", {
        users: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//* create a  new article
// Function to get the right format to store date in Mysql
const datetime = formatDate(new Date());
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}
exports.postNewArticle = (req, res) => {
  let { auth_id, tag, title, ArtHook, ArtBody } = req.body;
  const articleImage = req.file;
  DB.execute(
    "INSERT INTO blog_articles  (article_title, article_content, article_description, image_pathLocation, article_created_at, tags_id, author_id) VALUES (?,?,?,?,?,?,?)",
    [
      title,
      ArtBody,
      ArtHook,
      `${articleImage.originalname}`,
      datetime,
      `${tag.slice(0, 2)}`,
      `${auth_id.slice(0, 2)}`,
    ]
  )
    .then(() => {
      res.redirect("dash");
      console.log("article added successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};
