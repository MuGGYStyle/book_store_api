const express = require("express");
const {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  logout,
} = require("../controller/users");
const { getUserBooks } = require("../controller/books");
const { getUserComments } = require("../controller/comments");
const { protect, authorize } = require("../middleware/protect");

const router = express.Router();
// "/api/v1/users"
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/register").post(register);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

// "/api/v1/users"
router.use(protect);
router
  .route("/")
  .get(authorize("admin"), getUsers)
  .post(authorize("admin"), createUser);
router
  .route("/:id")
  .get(authorize("admin", "operator"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);

router
  .route("/:id/books")
  .get(authorize("admin", "operator", "user"), getUserBooks);

router.route("/:id/comments").get(getUserComments);

module.exports = router;
