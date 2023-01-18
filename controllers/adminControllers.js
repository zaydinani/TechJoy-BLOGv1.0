const dash = require("../models/dash");
const subscribers = require("../models/subscribers");
const users = require("../models/user");
const DB = require("../utils/database");

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

/*get users data */
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
