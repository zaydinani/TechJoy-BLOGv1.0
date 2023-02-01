const express = require("express");
const DB = require("../utils/database");
const adminController = require("../controllers/adminControllers");
const marked = require("marked");
const isAdmin = require("../middleware/is-admin");

const router = express.Router();

//! admins routes 
//? admin sign up 
router.post("/admin_register",isAdmin, adminController.postAdminRegister);
router.get("/admin_register",isAdmin, adminController.getAdminRegister);
//? admin sign in 
router.post("/admin_signIn", adminController.postAdminSignIn);
router.get("/admin_signIn", adminController.getAdminSignIn);



//! dashboard ROUTES
//* get new articles router
router.get("/new-article", isAdmin, adminController.getNewArticle);
//* POST new articles router
router.post("/creatingArticle", isAdmin, adminController.postNewArticle);
//* get new tag router
router.post("/add-tag", isAdmin, adminController.addTag);
//* articles router for dashboard
router.get("/dash", isAdmin, adminController.getArticles);
//* subscribers router for dashboard
router.get("/subscribers", isAdmin, adminController.getSubscribers);
//* users router for dashboard
router.get("/users", isAdmin, adminController.getUsers);
//* admins router for dashboard
router.get("/admins", isAdmin, adminController.getAdmins);

//! CRUD OPERATIONS FOR DASHBOARD
//? DELETE admin FROM DASHBOARD
router.get("/admin/delete/admin/:id", function (req, res, next) {
  let id = req.params.id;
  let query = `delete from blog_admins where admin_id = ?`;
  DB.execute(query, [id])
    .then(() => {
      res.redirect("back");
      console.log("admin deleted successfully");
    })
    .catch((err) => {
      console.log(err);
    });
});

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
    })
    .catch((err) => {
      console.log(err);
    });
});

//? UPDATE AN ARTICLE  FROM DASHBOARD
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


router.post("/updateArticle", (req, res) => {
  let artId = req.body.article_id;
  const articleImage = req.file;

  DB.execute(
    `UPDATE blog_articles SET article_title = '${
      req.body.title
    }' , article_content =' ${req.body.ArtHook}', article_description = '${
      req.body.ArtBody
    }' , image_pathLocation =' /${
      articleImage.originalname
    }' , article_created_at = '${datetime}', tags_id = ${req.body.tag.slice(
      0,
      2
    )} , author_id = ${req.body.auth_id.slice(0, 2)} WHERE article_id = ${artId}
`
  )
    .then(() => {
      res.redirect("dash");
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

// * ----------------------------------SHOW ARTICLE CONTENT
// TODO: * -------------------------------- SWITCH TO ASYNC AWAIT * --------------------------------
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
                    console.log(user);
                    console.log(aComment);
                    res.render("article", {
                      isLoggedIn: req.session.isLoggedIn,
                      isAdmin: req.session.isAdmin,
                      articleData: marked.use(data),
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
                  isAdmin: req.session.isAdmin,
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
