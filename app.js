const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// *SETING TAMPLATE ENGINE
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
// *serving static files
app.use(express.static(path.join(__dirname, "public")));

const blogRouter = require("./router/blog_usr");
const adminRouter = require("./router/admin");

app.use(blogRouter);
app.use(adminRouter);

const port = 3000;
app.listen(port);
