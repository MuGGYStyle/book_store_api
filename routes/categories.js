const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");
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
router
  .route("/")
  .get(getCategories)
  .post(protect, authorize("admin"), createCategory);

// /api/v1/categories/:id
router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

// /api/v1/categories/:id/upload-photo
router
  .route("/:id/upload-photo")
  .put(protect, authorize("admin", "operator"), uploadCategoryPhoto);

module.exports = router;
