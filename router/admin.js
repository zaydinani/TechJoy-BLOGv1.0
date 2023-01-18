const path = require("path");

const express = require("express");
const DB = require("../utils/database");
const blogController = require("../controllers/adminControllers");
const database = require("../utils/database");
const dash = require("../models/dash");
const router = express.Router();

//! dashboard ROUTES

// Create new articles router for dashboard
router.get("/newArticle", blogController.getNewArticle);
// articles router for dashboard
router.get("/dash", blogController.getArticles);
// subscribers router for dashboard
router.get("/subscribers", blogController.getSubscribers);
// users router for dashboard
router.get("/users", blogController.getUsers);

//! CRUD OPERATIONS FOR DASHBOARD
//? DELETE ARTICLE FROM DASHBOARD
router.get("/admin/delete/article/:id", function (req, res, next) {
  let id = req.params.id;
  console.log(id);
  let query = ` delete from blog_articles where article_id = ?`;
  DB.execute(query, [id])
    .then(() => {
      res.redirect("back");
      console.log("article deleted successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});
//? DELETE USERS FROM DASHBOARD
router.get("/admin/delete/user/:id", function (req, res, next) {
  let id = req.params.id;
  console.log(id);
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

module.exports = router;
