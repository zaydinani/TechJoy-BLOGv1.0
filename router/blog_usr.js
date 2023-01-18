const path = require("path");

const express = require("express");

const blogController = require("../controllers/blogController");
const router = express.Router();

router.get("/login", blogController.getLogin);
router.get("/contact", blogController.getContact);
router.get("/FAQ", blogController.getFAQ);
router.get("/blog", blogController.getBlogPage);
router.get("/home", blogController.getHome);
router.get("/", blogController.getHome);

module.exports = router;
