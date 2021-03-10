/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "comment",
    {
      id: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      bookId: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        references: {
          model: "book",
          key: "id",
        },
      },
      comment: {
        type: DataTypes.STRING(450),
        allowNull: false,
        validate: {
          // isEmail: {
          //   msg: "Заавал имэйл оруулна уу",
          // },
          notContains: {
            args: ["Пизда"],
            msg: "Энэ мессежинд хориглогдсон үг байна",
          },
          // customValidator(value) {
          //   if (value === null && this.age !== 10) {
          //     throw new Error("name can't be null unless age is 10");
          //   }
          // },
          // min: {
          //   args: [20],
          //   msg: "Хамгийн багадаа 20 байна",
          // },
        },
        get() {
          return this.getDataValue("comment").toUpperCase();
        },
        set(value) {
          this.setDataValue("comment", value.replace("миа", "тиймэрхүү"));
        },
      },
    },
    {
      tableName: "comment",
      timestamps: true,
    }
  );
};
