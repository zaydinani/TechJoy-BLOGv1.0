const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const app = express();
// *SETING TAMPLATE ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
// *serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
//*intialze session middleware
let options = {
  host: "localhost",
  user: "root",
  password: "Mtm2022!4L",
  database: "tech_joy",
};
let sessionStore = new MySQLStore(options);
app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

const blogRouter = require("./router/blog_usr");
const adminRouter = require("./router/admin");

app.use(blogRouter);
app.use(adminRouter);
const port = 3000;
app.listen(port);
