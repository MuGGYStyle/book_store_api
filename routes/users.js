const express = require("express");
const router = express.Router();
const { register } = require("../controller/users");

// "/api/v1/users"
router.route("/").post(register);

module.exports = router;
