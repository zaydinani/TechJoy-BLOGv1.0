const path = require("path");

const express = require("express");

const blogController = require("../controllers/adminControllers");
const router = express.Router();

router.get("/dash", blogController.getDash);

module.exports = router;
