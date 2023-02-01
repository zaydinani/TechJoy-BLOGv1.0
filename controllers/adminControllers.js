const dash = require("../models/dash");
const subscribers = require("../models/subscribers");
const users = require("../models/user");
const DB = require("../utils/database");
const marked = require("marked");
const admins = require("../models/admins");
const bcrypt = require("bcrypt");

//! ADD TAG 
exports.addTag = (req, res, next) => {
  const tag = req.body.tag;
  console.log(tag);
  DB.execute('SELECT tag_name FROM blog_tags')
  .then(([rows, fields]) => {
    let taken = false;
    rows.forEach((row) => {
      if (row.tag_name == tag) {
        res.redirect("back")
        return taken = true;
      }
    })
    if (!taken) {
      DB.execute('INSERT INTO blog_tags (tag_name) VALUES (?)', [tag])
      .then(() => {
        res.redirect("back");
      }).catch((err) => {
        console.log(err);
      })
    }
  })
}
//! admins signup 
//? post sign up 
exports.postAdminRegister = (req, res, next) => {
  const admin_username = req.body.full_Name;
  const admin_email = req.body.Reg_email;
  const admin_password = req.body.password;
  const admin_confirmPassword = req.body.Cpassword;
  console.log(admin_username, admin_email, admin_password, admin_confirmPassword)
  DB.execute('SELECT admin_email FROM blog_admins')
  .then(([rows, fields]) => {
    let taken = false;
    rows.forEach((row) => {
      if (row.admin_email == admin_email) {
        res.render('register', {
          errMsg: "Email already taken",
          admin: false,
        })
        return taken = true;
      }
    })
    if (!taken) {
      bcrypt.hash(admin_password, 10, (err, hash) => {
        DB.execute('INSERT INTO blog_admins (admin_username, admin_email, admin_password, admin_img_path) VALUES (?,?,?,?)', 
        [admin_username, admin_email, hash, "./images/zyd_inn.jpg"])
        .then(() => {
          res.render('login', {
            errMsg: false,
            admin: true,

          })
        })
        .catch((err) => {
          console.log(err)
        })
      })
    }
  })
  .catch((err) => {
    console.log(err)
  });
};
//? get sign up 
exports.getAdminRegister = (req, res, next) => {
  res.render("register", {
    admin: true,
    errMsg: false,
  });
};

//! admins login 
//? post login
exports.postAdminSignIn = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  console.log(email, password)
  DB.execute(
    'SELECT admin_id, admin_email, admin_password FROM blog_admins WHERE admin_email = ?', [email]
  ).then(([rows, fields]) => {
    let {admin_id, admin_email, admin_password } =  rows[0]  ;
    bcrypt.compare(password, admin_password, (err, result) => {
      if (result) {
        req.session.isAdmin = true;
        req.session.adminId = admin_id;
        res.redirect('dash')
        console.log(req.session)
        
      } else {
        res.render('login', {
          errMsg: "Invalid email or password",
          admin: true,
          
          
        })
        console.log('admin log in failed due to incorrect email or password')
      }
    })
  })
  .catch((err) => {
    console.log(err)
  })
};

//? get login
exports.getAdminSignIn = (req, res, next) => {
  res.render("login", {
    admin: true,
    errMsg: false,
    
  });
};




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
            isAdmin: req.session.isAdmin,
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
        adminData: rows,
        
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
        adminData: rows,
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
        adminData: rows,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
//*get admins data
exports.getAdmins = (req, res, next) => {
  admins
    .admins()
    .then(([rows, fieldData]) => {
      res.render("admins", {
        admins: rows,
        adminData: rows,
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
      marked.parse(ArtBody),
      ArtHook,
      `/${articleImage.originalname}`,
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
