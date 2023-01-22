const path = require("path");

const express = require("express");
const DB = require("../utils/database");
const adminController = require("../controllers/adminControllers");

const router = express.Router();

//! dashboard ROUTES

//* get  new articles router
router.get("/new-article", adminController.getNewArticle);
//* POST  new articles router
router.post("/creatingArticle", adminController.postNewArticle);

// articles router for dashboard
router.get("/dash", adminController.getArticles);
// subscribers router for dashboard
router.get("/subscribers", adminController.getSubscribers);
// users router for dashboard
router.get("/users", adminController.getUsers);

//! CRUD OPERATIONS FOR DASHBOARD
//? DELETE ARTICLE FROM DASHBOARD
router.get("/admin/delete/article/:id", function (req, res, next) {
  let id = req.params.id;
  let query = `delete from blog_articles where article_id = ?`;
  DB.execute(query, [id])
    .then(() => {
      res.redirect("back");
      console.log("article deleted successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});

//? Edit ARTICLE FROM DASHBOARD
router.get("/admin/edit/article/:id", function (req, res, next) {
  let id = req.params.id;
  DB.execute(`SELECT * FROM blog_articles where article_id = ${id}`)
    .then(([rows, fieldData]) => {
      res.render("new-article", {
        isLoggedIn: req.session.isLoggedIn,
        articleData: [...rows],
        editMode: true,
      });
      console.log(rows);
    })
    .catch((err) => {
      console.log(err);
    });
});
//? DELETE USERS FROM DASHBOARD
router.get("/admin/delete/user/:id", function (req, res, next) {
  let id = req.params.id;
  let query = ` delete from blog_users where user_id = ?`;
  DB.execute(query, [id])
    .then(() => {
      res.redirect("back");
      console.log("user deleted successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});

// * ----------------------------------SHOW ARTICLE
// TODO: * -------------------------------- SWITCH TO AYSNC AWAIT * --------------------------------
router.get("/checkArticle/:art_id", (req, res) => {
  let id = req.params.art_id;
  // * FETCHING ARTICLE DATA
  DB.execute(`SELECT * FROM blog_articles where article_id = '${id}'`)
    .then(([row, field]) => {
      const data = row;
      const tagId = data[0].tags_id;
      // * FETCHING tag DATA
      DB.execute(`SELECT * FROM blog_tags where tag_id  = '${tagId}'`)
        .then(([tag, field]) => {
          const tagData = tag;
          DB.execute(`SELECT * FROM blog_comments WHERE article_id = '${id}'`)
            .then(([comment, field]) => {
              const aComment = comment;
              let usersIds = [];
              aComment.forEach((anId) => {
                usersIds.push(anId.user_id);
                return usersIds;
              });
              // * Cheking for comments
              if (usersIds.length > 0) {
                // * FETCHING USER DATA
                DB.execute(
                  `SELECT user_id,user_name FROM blog_users WHERE user_id IN (${usersIds}) `
                )
                  .then(([user, field]) => {
                    res.render("article", {
                      isLoggedIn: req.session.isLoggedIn,
                      articleData: data,
                      tagData: tagData,
                      comments: aComment,
                      user: user,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
                return;
              } else {
                res.render("article", {
                  isLoggedIn: req.session.isLoggedIn,
                  articleData: data,
                  tagData: tagData,
                  comments: aComment,
                  user: null,
                });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
module.exports = router;
