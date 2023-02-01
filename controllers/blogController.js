const homeLg = require("../models/HomeLg");
const bloogFeed = require("../models/blgFeed");
const nodemailer = require("nodemailer");
const DB = require("../utils/database");
const bcrypt = require("bcrypt");

exports.getProfile = (req, res, next) => {
  DB.execute(
    `SELECT user_name ,user_email from blog_users WHERE user_id = ${req.session.userId}`
  )
    .then(([row, fieldData]) => {
      res.render("edit_user", {
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,
        errMsg: false,
        userData: row,
      });
    })
    .catch((err) => console.log(err));
};

//update profile
exports.postUpdateProfile = (req, res, next) => {
  DB.execute(
    `SELECT user_name , user_email FROM blog_users WHERE user_email = '${req.body.Reg_email}'`
  )
    .then(([row, fieldData]) => {
      if (row.length > 0) {
        res.render("edit_user", {
          isLoggedIn: req.session.isLoggedIn,
          errMsg: "Email is already taken please try again",
          userData: row,
        });
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          DB.execute(
            `UPDATE blog_users SET user_name = '${req.body.full_Name}', user_email ='${req.body.Reg_email}',
             user_password = '${hash}' WHERE user_id = ${req.session.userId}`
          )
            .then(() => {
              req.session.destroy(() => {
                res.redirect("/");
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    })
    .catch((err) => console.log(err));
};
exports.getLogin = (req, res, next) => {
  res.render("login", {
    errMsg: false,
    admin: false,
  });
};
exports.getRegister = (req, res, next) => {
  res.render("register", {
    errMsg: false,
    admin: false,
  });
};
exports.getContact = (req, res, next) => {
  res.render("contact", {
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};
exports.getFAQ = (req, res, next) => {
  res.render("FAQ", {
    isLoggedIn: req.session.isLoggedIn,
    isAdmin: req.session.isAdmin,
  });
};

exports.getBlogPage = (req, res, next) => {
  bloogFeed
    .articlesData()
    .then(([rows, fieldData]) => {
      res.render("blog", {
        articlesData: rows,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,

      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getHome = (req, res, next) => {
  homeLg
    .CheckOutArtciles()
    .then(([rows, fieldData]) => {
      res.render("home", {
        artl: rows,
        isLoggedIn: req.session.isLoggedIn,
        isAdmin: req.session.isAdmin,

      });
    })
    .catch((err) => {
      console.log(err);
    });
};

//----------------------------- POST

// Function to get the right format to store date in Mysql
const datetime = formatDate(new Date());
function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join("-") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
}

// Adding New  Comment
exports.postComment = (req, res, next) => {
  const userId = req.session.userId;
  let artId = req.params;
  const artContent = req.body.comment;
  DB.execute(
    `INSERT INTO blog_comments (user_id, article_id, comment_content, comment_created_at) VALUES (${userId},${
      artId.userId
    },"${artContent}","${datetime.slice(0, 10)}")`
  )
    .then(res.redirect("back"))
    .catch((err) => console.log(err));
};
// log out Controller
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.postLogin = (req, res, next) => {
  DB.execute(
    `SELECT user_id,user_email ,user_password FROM blog_users WHERE user_email = "${req.body.email}"`
  )
    .then(([row, fieldData]) => {
      let { user_id, user_email, user_password } = { ...row[0] };
      bcrypt.compare(req.body.password, user_password, function (err, result) {
        if (result) {
          req.session.isLoggedIn = true;
          req.session.userId = user_id;
          res.redirect("/");
        } else {
          res.render("login", {
            admin: false,
            errMsg: "Either email or password is incorrect",
          });
          console.log("failed" + " " + err);
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postRegister = (req, res, next) => {
  DB.execute("SELECT user_id,user_email FROM blog_users")
    .then(([rows, fieldData]) => {
      let taken = false;
      rows.forEach((row) => {
        if (row.user_email == req.body.Reg_email) {
          res.render("register", {
            errMsg: "THIS EMAIL IS TAKEN PLEASE TRY ANOTHER EMAIL",
            admin: false,

          });
          return (taken = true);
        }
      });
      if (!taken) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          DB.execute(
            "INSERT INTO blog_users (user_name,user_email,user_password,image_pathLocation,user_created_at) VALUES (?,?,?,?,?)",
            [
              req.body.full_Name,
              req.body.Reg_email,
              hash,
              "user-dflt.png",
              datetime,
            ]
          )
            .then(() => {
              res.render("login", {
                errMsg: false,
                admin: false,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postSaveMailBlogPG = (req, res, next) => {
  const emailbg = req.body.sub_usrEmail_feedpg;
  DB.execute(
    "INSERT INTO blog_subscribers (subscriber_email,subscriber_subscribed_at)VALUES (?,?)",
    [emailbg, datetime]
  )
    .then(() => {
      res.render("THFOLDER/ty");
      console.log("Email had been added");
      return;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postSaveMail = (req, res, next) => {
  const email = req.body.new_email;

  DB.execute(
    "INSERT INTO blog_subscribers (subscriber_email,subscriber_subscribed_at)VALUES (?,?)",
    [email, datetime]
  )
    .then(() => {
      res.render("thnkpage");
      console.log("Email had been added");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postThankPage = (req, res, next) => {
  const { contactor, contactor_email, contactor_sub, contactor_msg } = {
    ...req.body,
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: "marsoumtm@gmail.com",
    subject: contactor_sub,
    html: `
        <h2>NEW EMAIL FROM ${contactor}</h2>
        <br />
        <h2>EMAIL ADDRESS :</h2>
        <span>${contactor_email}</span>
        <hr/ >
        <span>content</span>
        <br /><br /><br />
        <h3><strong>${contactor_msg}</strong></h3>
        <span>${datetime}</span>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.render("errorPage", {
        isLoggedIn: req.session.isLoggedIn,
      });
      return;
    } else {
      console.log("Email sent: " + info.response);
      res.render("sub_thk", {
        isLoggedIn: req.session.isLoggedIn,
      });
    }
  });
};

exports.postContactPage = (req, res, next) => {
  const { conta_name, conta_email, conta_msg } = {
    ...req.body,
  };
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAILER_USER,
    to: "marsoumtm@gmail.com",
    subject: `@TechJoy check out  new message from ${conta_name}  `,
    html: `
        <h2>NEW EMAIL FROM ${conta_name}</h2>
        <br />
        <h2>EMAIL ADDRESS :</h2>
        <span>${conta_email}</span>
        <hr/ >
        <span>content</span>
        <br /><br /><br />
        <h3><strong>${conta_msg}</strong></h3>
        <span>${datetime}</span>
    `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.render("errorPage", {
        isLoggedIn: req.session.isLoggedIn,
      });
      return;
    } else {
      console.log("Email sent: " + info.response);
      res.render("sub_thk", {
        isLoggedIn: req.session.isLoggedIn,
      });
    }
  });
};
