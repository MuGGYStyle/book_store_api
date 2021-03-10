const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate-sequelize");

exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.create(req.body);
  res.status(200).json({
    success: true,
    comment,
  });
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError(req.params.id + " ID-тай коммент олдсонгүй", 400);
  }

  comment = await comment.update(req.body);

  res.status(200).json({
    success: true,
    comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError(req.params.id + " ID-тай коммент олдсонгүй", 400);
  }

  await comment.destroy();

  res.status(200).json({
    success: true,
    comment,
  });
});

exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await req.db.comment.findByPk(req.params.id);

  if (!comment) {
    throw new MyError(req.params.id + " ID-тай коммент олдсонгүй", 400);
  }

  const result = await req.db.sequelize.query("SELECT * FROM comment", {
    model: req.db.comment,
  });

  result[0].comment = "Солиотой";
  result[0].save();

  res.status(200).json({
    success: true,
    result,
    user: await comment.getUser(),
    book: await comment.getBook(),
    // magic: Object.keys(req.db.comment.prototype),
    comment,
  });
});

exports.getComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  let select = req.query.select;
  const total = await req.db.comment.count();

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(req.db.comment, page, limit, total);

  let query = { offset: pagination.start - 1, limit };

  if (req.query) {
    query.where = req.query;
  }

  if (select) {
    query.attributes = select.split(" ");
  }

  if (sort) {
    query.order = sort
      .split(" ")
      .map((el) => [
        el.charAt(0) === "-" ? el.substring(1) : el,
        el.charAt(0) === "-" ? "DESC" : "ASC",
      ]);
  }

  const comments = await req.db.comment.findAll(query);

  res.status(200).json({
    success: true,
    // query,
    comments,
    pagination,
  });
});

// Lazy loading
exports.getUserComments = asyncHandler(async (req, res, next) => {
  let user = await req.db.user.findByPk(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тай хэрэглэгч олдсонгүй", 400);
  }

  const comments = await user.getComments();

  res.status(200).json({
    success: true,
    user,
    comments,
  });
});

// Eager loading
exports.getBookComments = asyncHandler(async (req, res, next) => {
  let book = await req.db.book.findByPk(req.params.id, {
    include: req.db.comment,
  });

  if (!book) {
    throw new MyError(req.params.id + " ID-тай ном олдсонгүй", 400);
  }

  res.status(200).json({
    success: true,
    book,
  });
});
