const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryPhoto,
} = require("../controller/categories");

// /api/v1/categories/:categoryId/books
const { getCategoryBooks } = require("../controller/books");
router.route("/:categoryId/books").get(getCategoryBooks);

// const booksRouter = require("./books");
// router.use("/:categoryId/books", booksRouter);

// /api/v1/categories
router.route("/").get(getCategories).post(createCategory);

// /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

// /api/v1/categories/:id/photo
router.route("/:id/photo").put(uploadCategoryPhoto);

module.exports = router;
