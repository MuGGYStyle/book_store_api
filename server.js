const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const injectDb = require("./middleware/injectDb");

// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

const app = express();

connectDB();

const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

var whitelist = ["http://localhost:3000", "http://localhost:5000"];
var corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      // Болно
      callback(null, true);
    } else {
      // Хориглоно
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Body parser
app.use(cookieParser());
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(injectDb(db));
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use(errorHandler);

db.user.belongsToMany(db.book, { through: db.comment });
db.book.belongsToMany(db.user, { through: db.comment });
// magic method нэмж үүсгэхийн тулд
db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);
// magic method нэмж үүсгэхийн тулд
db.book.hasMany(db.comment);
db.comment.belongsTo(db.book);

db.category.hasMany(db.book);
db.book.belongsTo(db.category);

db.sequelize
  .sync()
  .then((res) => console.log("Sync хийгдлээ".underline.green))
  .catch((err) => console.log(err));

const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
