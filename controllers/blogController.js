const homeLg = require("../models/HomeLg");
const bloogFeed = require("../models/blgFeed");
const nodemailer = require("nodemailer");
const DB = require("../utils/database");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("login", {
    errMsg: false,
  });
};
exports.getRegister = (req, res, next) => {
  res.render("register", {
    errMsg: false,
  });
};
exports.getContact = (req, res, next) => {
  res.render("contact", {
    isLoggedIn: req.session.isLoggedIn,
  });
};
exports.getFAQ = (req, res, next) => {
  res.render("FAQ");
};

exports.getBlogPage = (req, res, next) => {
  bloogFeed
    .articlesData()
    .then(([rows, fieldData]) => {
      res.render("blog", {
        articlesData: rows,
        isLoggedIn: req.session.isLoggedIn,
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
          res.redirect("/");
        } else {
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
      user: "techJoyMailer22@gmail.com",
      pass: "sbkjkcwyjkuhldze",
    },
  });

  const mailOptions = {
    from: "techJoyMailer22@gmail.com",
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
      res.render("errorPage");
      return;
    } else {
      console.log("Email sent: " + info.response);
      res.render("sub_thk");
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
      user: "techJoyMailer22@gmail.com",
      pass: "sbkjkcwyjkuhldze",
    },
  });

  const mailOptions = {
    from: "techJoyMailer22@gmail.com",
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
      res.render("errorPage");
      return;
    } else {
      console.log("Email sent: " + info.response);
      res.render("sub_thk");
    }
  });
};
