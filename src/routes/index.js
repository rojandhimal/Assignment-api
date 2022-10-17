
const express = require('express');
const { authentication } = require('../middleware/auth');
const router = express.Router();

// routes
router.use("/auth",require("./auth"))
router.use("/practitioner",authentication,require("./practitioner"))
router.use("/role",authentication,require("./role"))
router.use("/user",authentication,require("./user"))

module.exports = router