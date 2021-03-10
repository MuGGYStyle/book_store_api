const Sequelize = require("sequelize");

var db = {};

const sequelize = new Sequelize(
  process.env.SEQUELIZE_DATABASE,
  process.env.SEQUELIZE_USER,
  process.env.SEQUELIZE_USER_PASSWORD,
  {
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    define: {
      freezeTableName: true,
    },
    pool: {
      max: 10, // max 10 connection
      min: 0, // min 0 connection
      acquire: 60000, // энэ pool дотроос connection-оо олж авхад дээд тал нь 60 секунд хүлээнэ
      idle: 10000, // хэнч ашиглахгүй 10 секунд болуул тухайн connection-ийг pool-ээс устга
    },
    operatorAliases: false,
  }
);

const models = [
  require("../models/sequelize/book"),
  require("../models/sequelize/user"),
  require("../models/sequelize/category"),
  require("../models/sequelize/comment"),
];

models.forEach((model) => {
  const seqModel = model(sequelize, Sequelize);
  db[seqModel.name] = seqModel;
});

db.sequelize = sequelize;

module.exports = db;
